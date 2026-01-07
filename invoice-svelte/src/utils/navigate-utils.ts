import { navigate } from 'sv-router/generated';

class NavigateUtils {
  goHome() {
    navigate('/');
  }

  goProducts() {
    navigate('/productos');
  }

  goCreateProduct() {
    navigate('/productos/crear');
  }

  goProductEdit(id: string) {
    navigate('/productos/editar/:id', { params: { id } });
  }

  goQrScanner() {
    (navigate as any)('/qr-scanner');
  }
}

export const navigateUtils = new NavigateUtils();
