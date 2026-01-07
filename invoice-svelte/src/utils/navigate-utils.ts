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
}

export const navigateUtils = new NavigateUtils();
