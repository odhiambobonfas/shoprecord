'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import DashboardLayout from '../../../components/layout/DashboardLayout.component';
import ProductForm from '../../../components/products/ProductForm.component';
import Card from '../../../components/ui/Card.ui';
import Button from '../../../components/ui/Button.ui';
import Modal from '../../../components/ui/Modal.ui';
import productService from '../../../services/productService.service';

export default function NewProductPage() {
  const router = useRouter();
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [formModified, setFormModified] = useState(false);

  const handleSubmit = async (productData) => {
    try {
      await productService.createProduct(productData);
      setShowSuccessModal(true);
      setTimeout(() => {
        router.push('/products');
      }, 2000);
    } catch (error) {
      throw error;
    }
  };

  const handleCancel = () => {
    if (formModified) {
      setShowCancelDialog(true);
    } else {
      router.push('/products');
    }
  };

  const confirmCancel = () => {
    setShowCancelDialog(false);
    router.push('/products');
  };

  const containerStyles = {
    maxWidth: '900px',
    margin: '0 auto',
  };

  const headerStyles = {
    marginBottom: '32px',
    position: 'relative',
  };

  const breadcrumbStyles = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '12px',
    fontSize: '14px',
    color: '#6b7280',
  };

  const breadcrumbLinkStyles = {
    color: '#3b82f6',
    textDecoration: 'none',
    cursor: 'pointer',
    transition: 'color 0.2s',
  };

  const titleContainerStyles = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '8px',
  };

  const titleStyles = {
    fontSize: '24px',
    fontWeight: '700',
    color: '#111827',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  };

  const iconStyles = {
    fontSize: '24px',
  };

  const subtitleStyles = {
    fontSize: '13px',
    color: '#6b7280',
    lineHeight: '1.6',
  };

  const tipsCardStyles = {
    marginBottom: '24px',
    padding: '20px',
    backgroundColor: '#eff6ff',
    borderRadius: '12px',
    border: '1px solid #bfdbfe',
  };

  const tipsHeaderStyles = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '12px',
    fontSize: '16px',
    fontWeight: '600',
    color: '#1e40af',
  };

  const tipItemStyles = {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '8px',
    marginBottom: '8px',
    fontSize: '14px',
    color: '#1e40af',
  };

  const buttonContainerStyles = {
    marginTop: '24px',
    display: 'flex',
    gap: '12px',
  };

  return (
    <DashboardLayout>
      <div style={containerStyles}>
        <div style={headerStyles}>
          {/* Breadcrumb */}
          <div style={breadcrumbStyles}>
            <span
              style={breadcrumbLinkStyles}
              onClick={() => router.push('/dashboard')}
              onMouseOver={(e) => e.target.style.color = '#2563eb'}
              onMouseOut={(e) => e.target.style.color = '#3b82f6'}
            >
              Dashboard
            </span>
            <span>›</span>
            <span
              style={breadcrumbLinkStyles}
              onClick={() => router.push('/products')}
              onMouseOver={(e) => e.target.style.color = '#2563eb'}
              onMouseOut={(e) => e.target.style.color = '#3b82f6'}
            >
              Products
            </span>
            <span>›</span>
            <span style={{ color: '#111827', fontWeight: '500' }}>Add New</span>
          </div>

          {/* Title */}
          <div style={titleContainerStyles}>
            <h1 style={titleStyles}>
              <span style={iconStyles}>📦</span>
              Add New Product
            </h1>
          </div>
          <p style={subtitleStyles}>
            Create a new product entry for your inventory. All fields marked with * are required.
          </p>
        </div>

        {/* Quick Tips */}
        <div style={tipsCardStyles}>
          <div style={tipsHeaderStyles}>
            <span>💡</span>
            <span>Quick Tips for Adding Products</span>
          </div>
          <div style={tipItemStyles}>
            <span>•</span>
            <span>Use clear, descriptive product names for easy inventory management</span>
          </div>
          <div style={tipItemStyles}>
            <span>•</span>
            <span>Set realistic pricing based on cost and desired profit margins</span>
          </div>
          <div style={tipItemStyles}>
            <span>•</span>
            <span>Add detailed descriptions to help track product variations</span>
          </div>
          <div style={tipItemStyles}>
            <span>•</span>
            <span>Set minimum stock levels to receive low inventory alerts</span>
          </div>
          <div style={tipItemStyles}>
            <span>•</span>
            <span>Organize products by category for better inventory tracking</span>
          </div>
        </div>

        {/* Form Card */}
        <Card>
          <ProductForm onSubmit={handleSubmit} submitLabel="Create Product" />
          <div style={buttonContainerStyles}>
            <Button onClick={handleCancel} variant="outline" fullWidth>
              Cancel
            </Button>
          </div>
        </Card>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <Modal onClose={() => setShowSuccessModal(false)}>
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>✅</div>
            <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#111827', marginBottom: '8px' }}>
              Product Created Successfully!
            </h3>
            <p style={{ fontSize: '13px', color: '#6b7280' }}>
              Redirecting to products page...
            </p>
          </div>
        </Modal>
      )}

      {/* Cancel Confirmation Dialog */}
      {showCancelDialog && (
        <Modal onClose={() => setShowCancelDialog(false)}>
          <div style={{ padding: '20px' }}>
            <div style={{ fontSize: '40px', textAlign: 'center', marginBottom: '16px' }}>⚠️</div>
            <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#111827', marginBottom: '12px', textAlign: 'center' }}>
              Discard Changes?
            </h3>
            <p style={{ fontSize: '13px', color: '#6b7280', textAlign: 'center', marginBottom: '24px' }}>
              You have unsaved changes. Are you sure you want to leave this page?
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <Button onClick={() => setShowCancelDialog(false)} variant="outline" fullWidth>
                Continue Editing
              </Button>
              <Button onClick={confirmCancel} fullWidth>
                Discard Changes
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </DashboardLayout>
  );
}
