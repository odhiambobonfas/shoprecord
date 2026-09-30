'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '../../../components/layout/DashboardLayout.component';
import ProductForm from '../../../components/products/ProductForm.component';
import Card from '../../../components/ui/Card.ui';
import Button from '../../../components/ui/Button.ui';
import Loading from '../../../components/ui/Loading.ui';
import Alert from '../../../components/ui/Alert.ui';
import productService from '../../../services/productService.service';

export default function EditProductPage({ params }) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();
  const { id } = params;

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const data = await productService.getProduct(id);
      setProduct(data.product || data);
    } catch (err) {
      setError('Failed to load product');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (productData) => {
    try {
      await productService.updateProduct(id, productData);
      setTimeout(() => {
        router.push('/products');
      }, 1500);
    } catch (error) {
      throw error;
    }
  };

  const handleCancel = () => {
    router.push('/products');
  };

  const headerStyles = {
    marginBottom: '24px',
  };

  const titleStyles = {
    fontSize: '22px',
    fontWeight: '700',
    color: '#111827',
    marginBottom: '8px',
  };

  const subtitleStyles = {
    fontSize: '13px',
    color: '#6b7280',
  };

  const buttonContainerStyles = {
    marginTop: '16px',
  };

  if (loading) {
    return (
      <DashboardLayout>
        <Loading message="Loading product..." />
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <Alert type="error" message={error} />
        <Button onClick={() => router.push('/products')}>
          Back to Products
        </Button>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div style={headerStyles}>
        <h1 style={titleStyles}>Edit Product</h1>
        <p style={subtitleStyles}>Update the product details below</p>
      </div>

      <Card>
        <ProductForm
          initialData={product}
          onSubmit={handleSubmit}
          submitLabel="Update Product"
        />
        <div style={buttonContainerStyles}>
          <Button onClick={handleCancel} variant="outline" fullWidth>
            Cancel
          </Button>
        </div>
      </Card>
    </DashboardLayout>
  );
}
