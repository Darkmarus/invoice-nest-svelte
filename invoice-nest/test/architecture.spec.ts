import * as fs from 'fs';
import * as path from 'path';

describe('Arquitectura Hexagonal', () => {
  const libsPath = path.join(__dirname, '..', 'libs');
  const domainPath = path.join(libsPath, 'domain');
  const applicationPath = path.join(libsPath, 'application');
  const infrastructurePath = path.join(libsPath, 'infrastructure');

  const getAllFiles = (dir: string, files: string[] = []): string[] => {
    if (!fs.statSync(dir).isDirectory()) return files;

    const items = fs.readdirSync(dir);
    for (const item of items) {
      const fullPath = path.join(dir, item);
      if (fs.statSync(fullPath).isDirectory()) {
        getAllFiles(fullPath, files);
      } else if (item.endsWith('.ts')) {
        files.push(fullPath);
      }
    }
    return files;
  };

  const getFileContent = (filePath: string): string => {
    return fs.readFileSync(filePath, 'utf-8');
  };

  const checkImportViolations = (
    filePath: string,
    allowedPaths: string[],
  ): string[] => {
    const content = getFileContent(filePath);
    const violations: string[] = [];

    const importRegex = /from\s+['"]([^'"]+)['"]/g;
    let match;

    while ((match = importRegex.exec(content)) !== null) {
      const importPath = match[1];

      if (importPath.startsWith('@app/')) {
        const libName = importPath.split('/')[1];
        if (!allowedPaths.includes(libName)) {
          violations.push(`Import no permitido: ${importPath} en ${filePath}`);
        }
      }
    }

    return violations;
  };

  describe('Domain Layer', () => {
    it('No debe tener dependencias de otras capas', () => {
      const domainFiles = getAllFiles(domainPath);
      const violations: string[] = [];

      for (const file of domainFiles) {
        const fileViolations = checkImportViolations(file, []);
        violations.push(...fileViolations);
      }

      expect(violations).toHaveLength(0);
    });
  });

  describe('Application Layer', () => {
    it('Solo puede depender de Domain Layer', () => {
      const applicationFiles = getAllFiles(applicationPath);
      const violations: string[] = [];

      for (const file of applicationFiles) {
        const fileViolations = checkImportViolations(file, [
          'domain',
          'application',
        ]);
        violations.push(...fileViolations);
      }

      expect(violations).toHaveLength(0);
    });
  });

  describe('Reglas de Arquitectura Hexagonal', () => {
    it('Domain no debe usar nada del framework NestJS', () => {
      const domainFiles = getAllFiles(domainPath);
      const violations: string[] = [];
      const nestjsModules = [
        '@nestjs/common',
        '@nestjs/core',
        '@nestjs/platform-express',
        '@nestjs/config',
        '@nestjs/swagger',
        '@nestjs/testing',
        '@nestjs/cli',
        '@nestjs/schematics',
        '@nestjs/throttler',
        '@nestjs/passport',
        '@nestjs/jwt',
        '@nestjs/typeorm',
        '@nestjs/mongoose',
        '@nestjs/sequelize',
        '@nestjs/microservices',
        '@nestjs/websockets',
        '@nestjs/graphql',
        '@nestjs/axios',
      ];

      for (const file of domainFiles) {
        const content = getFileContent(file);

        for (const module of nestjsModules) {
          const importRegex = new RegExp(`from\\s+['"]${module}['"]`, 'g');
          if (importRegex.test(content)) {
            violations.push(`Import NestJS en domain: ${file} - ${module}`);
          }
        }

        const decoratorRegex =
          /@(Injectable|Controller|Get|Post|Put|Delete|Patch|Param|Query|Body|Headers|Ip|Session|Host|Req|Res|Next|HttpCode|Redirect|Render|SetHeader|UseGuards|UsePipes|UseInterceptors|UseFilters|ApiTags|ApiOperation|ApiResponse|ApiParam|ApiQuery|ApiBody|ApiBearerAuth|ApiBasicAuth|ApiCookieAuth|ApiOAuth2|ApiKey|ApiProperty|ApiPropertyOptional|ApiHideProperty)/g;
        if (decoratorRegex.test(content)) {
          violations.push(`Decorator NestJS en domain: ${file}`);
        }
      }

      expect(violations).toHaveLength(0);
    });

    it('Application no debe usar nada del framework NestJS', () => {
      const applicationFiles = getAllFiles(applicationPath);
      const violations: string[] = [];
      const nestjsModules = [
        '@nestjs/common',
        '@nestjs/core',
        '@nestjs/platform-express',
        '@nestjs/config',
        '@nestjs/swagger',
        '@nestjs/testing',
        '@nestjs/cli',
        '@nestjs/schematics',
        '@nestjs/throttler',
        '@nestjs/passport',
        '@nestjs/jwt',
        '@nestjs/typeorm',
        '@nestjs/mongoose',
        '@nestjs/sequelize',
        '@nestjs/microservices',
        '@nestjs/websockets',
        '@nestjs/graphql',
        '@nestjs/axios',
      ];

      for (const file of applicationFiles) {
        const content = getFileContent(file);

        for (const module of nestjsModules) {
          const importRegex = new RegExp(`from\\s+['"]${module}['"]`, 'g');
          if (importRegex.test(content)) {
            violations.push(
              `Import NestJS en application: ${file} - ${module}`,
            );
          }
        }

        const decoratorRegex =
          /@(Injectable|Controller|Get|Post|Put|Delete|Patch|Param|Query|Body|Headers|Ip|Session|Host|Req|Res|Next|HttpCode|Redirect|Render|SetHeader|UseGuards|UsePipes|UseInterceptors|UseFilters|ApiTags|ApiOperation|ApiResponse|ApiParam|ApiQuery|ApiBody|ApiBearerAuth|ApiBasicAuth|ApiCookieAuth|ApiOAuth2|ApiKey|ApiProperty|ApiPropertyOptional|ApiHideProperty)/g;
        if (decoratorRegex.test(content)) {
          violations.push(`Decorator NestJS en application: ${file}`);
        }
      }

      expect(violations).toHaveLength(0);
    });

    it('Domain y Application deben ser agnósticas a la base de datos', () => {
      const domainFiles = getAllFiles(domainPath);
      const applicationFiles = getAllFiles(applicationPath);
      const violations: string[] = [];

      const databaseLibraries = [
        'knex',
        'pg',
        'mysql',
        'mysql2',
        'mongodb',
        'mongoose',
        'typeorm',
        'sequelize',
        'prisma',
        'redis',
        'ioredis',
        'sqlite3',
        'better-sqlite3',
      ];

      const checkFile = (file: string, layer: string) => {
        const content = getFileContent(file);

        for (const lib of databaseLibraries) {
          const importRegex = new RegExp(`from\\s+['"]${lib}['"]`, 'g');
          if (importRegex.test(content)) {
            violations.push(
              `Import base de datos en ${layer}: ${file} - ${lib}`,
            );
          }
        }
      };

      for (const file of domainFiles) {
        checkFile(file, 'domain');
      }

      for (const file of applicationFiles) {
        checkFile(file, 'application');
      }

      expect(violations).toHaveLength(0);
    });
  });
});
