'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '../../../components/layout/DashboardLayout.component';
import Card from '../../../components/ui/Card.ui';
import Button from '../../../components/ui/Button.ui';
import Input from '../../../components/ui/Input.ui';
import Alert from '../../../components/ui/Alert.ui';
import Modal from '../../../components/ui/Modal.ui';
import productService from '../../../services/productService.service';
import saleService from '../../../services/saleService.service';

export default function NewSalePage() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [customer, setCustomer] = useState({ name: 'Walk-in Customer', phone: '', email: '' });
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [discount, setDiscount] = useState(0);
  const [tax, setTax] = useState(0);
  const [amountPaid, setAmountPaid] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState('');
  const [lastInvoice, setLastInvoice] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await productService.getProducts();
      setProducts(data.data || []);
    } catch (error) {
      setError('Failed to load products');
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.barcode?.includes(searchTerm)
  );

  const addProductToSale = (product) => {
    const existing = selectedProducts.find(p => p.product === product._id);
    if (existing) {
      setSelectedProducts(selectedProducts.map(p =>
        p.product === product._id
          ? { ...p, quantity: p.quantity + 1 }
          : p
      ));
    } else {
      setSelectedProducts([...selectedProducts, {
        product: product._id,
        productName: product.name,
        sellingPrice: product.price,
        costPrice: product.costPrice || 0,
        quantity: 1,
        maxQuantity: product.quantity,
      }]);
    }
    setSearchTerm('');
  };

  const updateQuantity = (productId, newQuantity) => {
    setSelectedProducts(selectedProducts.map(p =>
      p.product === productId
        ? { ...p, quantity: Math.max(1, Math.min(newQuantity, p.maxQuantity)) }
        : p
    ));
  };

  const updatePrice = (productId, newPrice) => {
    setSelectedProducts(selectedProducts.map(p =>
      p.product === productId
        ? { ...p, sellingPrice: parseFloat(newPrice) || 0 }
        : p
    ));
  };

  const removeProduct = (productId) => {
    setSelectedProducts(selectedProducts.filter(p => p.product !== productId));
  };

  const calculateTotals = () => {
    const subtotal = selectedProducts.reduce((sum, item) =>
      sum + (item.sellingPrice * item.quantity), 0
    );
    const discountAmount = parseFloat(discount) || 0;
    const taxAmount = parseFloat(tax) || 0;
    const total = subtotal - discountAmount + taxAmount;
    
    return { subtotal, discountAmount, taxAmount, total };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (selectedProducts.length === 0) {
      setError('Please add at least one product to the sale');
      return;
    }

    setLoading(true);

    try {
      const { total } = calculateTotals();
      const paidAmount = parseFloat(amountPaid) || total;

      const saleData = {
        items: selectedProducts.map(item => ({
          product: item.product,
          quantity: item.quantity,
          sellingPrice: item.sellingPrice,
        })),
        paymentMethod,
        paymentStatus: paidAmount >= total ? 'paid' : 'partial',
        amountPaid: paidAmount,
        customer: customer.name ? customer : { name: 'Walk-in Customer' },
        discount: parseFloat(discount) || 0,
        tax: parseFloat(tax) || 0,
      };

      const result = await saleService.createSale(saleData);
      setLastInvoice(result);
      setShowSuccess(true);
      
      // Reset form
      setSelectedProducts([]);
      setCustomer({ name: 'Walk-in Customer', phone: '', email: '' });
      setDiscount(0);
      setTax(0);
      setAmountPaid(0);
      setPaymentMethod('cash');
      fetchProducts(); // Refresh product stock
    } catch (error) {
      setError(error.message || 'Failed to create sale');
    } finally {
      setLoading(false);
    }
  };

  const { subtotal, discountAmount, taxAmount, total } = calculateTotals();
  const balance = (parseFloat(amountPaid) || 0) - total;

  const containerStyles = {
    maxWidth: '1600px',
    margin: '0 auto',
    padding: '0 20px',
  };

  const gridStyles = {
    display: 'grid',
    gridTemplateColumns: '1fr 450px',
    gap: '24px',
    marginTop: '24px',
  };

  const headerStyles = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '28px',
    padding: '24px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    borderRadius: '16px',
    color: '#fff',
    boxShadow: '0 10px 30px rgba(102, 126, 234, 0.3)',
  };

  const titleStyles = {
    fontSize: '32px',
    fontWeight: '800',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  };

  return (
    <DashboardLayout>
      <div style={containerStyles}>
        <div style={headerStyles}>
          <h1 style={titleStyles}>
            <span style={{ fontSize: '40px' }}>🛒</span>
            <div>
              <div>Point of Sale</div>
              <div style={{ fontSize: '14px', fontWeight: '400', opacity: 0.9, marginTop: '4px' }}>
                Create new transactions quickly and efficiently
              </div>
            </div>
          </h1>
          <Button 
            onClick={() => router.push('/sales')} 
            style={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.2)', 
              backdropFilter: 'blur(10px)',
              border: '2px solid rgba(255, 255, 255, 0.3)',
              color: '#fff',
              fontWeight: '600',
            }}
          >
            📊 View History
          </Button>
        </div>

        {error && <Alert type="error" message={error} onClose={() => setError('')} />}

        <div style={gridStyles}>
          {/* Left: Product Selection */}
          <div>
            <Card hover style={{ background: 'linear-gradient(135deg, #fff 0%, #f8fafc 100%)' }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: '20px',
              }}>
                <h2 style={{ 
                  fontSize: '20px', 
                  fontWeight: '700', 
                  color: '#1f2937',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}>
                  <span style={{ 
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: '#fff',
                    fontSize: '18px',
                  }}>
                    🔍
                  </span>
                  Product Catalog
                </h2>
                <div style={{ 
                  padding: '6px 12px',
                  borderRadius: '20px',
                  background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
                  color: '#0369a1',
                  fontSize: '13px',
                  fontWeight: '600',
                }}>
                  {filteredProducts.length} Products
                </div>
              </div>
              
              <div style={{ position: 'relative', marginBottom: '16px' }}>
                <Input
                  type="text"
                  placeholder="🔎 Search by name, category, or scan barcode..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    paddingLeft: '20px',
                    fontSize: '15px',
                    borderRadius: '12px',
                    border: '2px solid #e5e7eb',
                  }}
                />
              </div>

              <div style={{ 
                maxHeight: '440px', 
                overflowY: 'auto', 
                marginTop: '16px',
                borderRadius: '12px',
                border: '2px solid #f1f5f9',
              }}>
                {filteredProducts.length === 0 ? (
                  <div style={{ 
                    padding: '60px 20px',
                    textAlign: 'center',
                    color: '#9ca3af',
                  }}>
                    <div style={{ fontSize: '48px', marginBottom: '12px' }}>🔍</div>
                    <p style={{ fontSize: '15px', fontWeight: '500' }}>No products found</p>
                    <p style={{ fontSize: '13px', marginTop: '4px' }}>Try a different search term</p>
                  </div>
                ) : (
                  filteredProducts.map(product => (
                    <div
                      key={product._id}
                      onClick={() => product.quantity > 0 && addProductToSale(product)}
                      style={{
                        padding: '16px',
                        borderBottom: '1px solid #f3f4f6',
                        cursor: product.quantity > 0 ? 'pointer' : 'not-allowed',
                        backgroundColor: product.quantity === 0 ? '#f9fafb' : '#fff',
                        opacity: product.quantity === 0 ? 0.6 : 1,
                        transition: 'all 0.2s ease',
                      }}
                      onMouseOver={(e) => {
                        if (product.quantity > 0) {
                          e.currentTarget.style.backgroundColor = '#f0f9ff';
                          e.currentTarget.style.transform = 'translateX(4px)';
                        }
                      }}
                      onMouseOut={(e) => {
                        if (product.quantity > 0) {
                          e.currentTarget.style.backgroundColor = '#fff';
                          e.currentTarget.style.transform = 'translateX(0)';
                        }
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ 
                            fontWeight: '700', 
                            color: '#111827',
                            fontSize: '15px',
                            marginBottom: '4px',
                          }}>
                            {product.name}
                          </div>
                          <div style={{ 
                            fontSize: '12px', 
                            color: '#6b7280',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                          }}>
                            <span style={{ 
                              padding: '2px 8px',
                              borderRadius: '4px',
                              backgroundColor: '#f3f4f6',
                              fontWeight: '600',
                            }}>
                              {product.category}
                            </span>
                            <span>•</span>
                            <span style={{ 
                              fontWeight: '600',
                              color: product.quantity <= 10 ? '#ef4444' : '#16a34a',
                            }}>
                              Stock: {product.quantity}
                            </span>
                          </div>
                        </div>
                        <div style={{ textAlign: 'right', marginLeft: '16px' }}>
                          <div style={{ 
                            fontWeight: '700', 
                            color: '#16a34a',
                            fontSize: '18px',
                            marginBottom: '4px',
                          }}>
                            ₹{product.price.toFixed(2)}
                          </div>
                          {product.quantity === 0 && (
                            <div style={{ 
                              fontSize: '10px', 
                              color: '#fff',
                              fontWeight: '700',
                              padding: '2px 8px',
                              borderRadius: '4px',
                              backgroundColor: '#ef4444',
                              textTransform: 'uppercase',
                            }}>
                              Out of Stock
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card>

            {/* Selected Products */}
            <Card hover style={{ marginTop: '24px', background: 'linear-gradient(135deg, #fff 0%, #fef3c7 5%, #fff 100%)' }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: '20px',
              }}>
                <h2 style={{ 
                  fontSize: '20px', 
                  fontWeight: '700',
                  color: '#1f2937',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}>
                  <span style={{ 
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                    color: '#fff',
                    fontSize: '18px',
                  }}>
                    🛒
                  </span>
                  Shopping Cart
                </h2>
                <div style={{ 
                  padding: '6px 12px',
                  borderRadius: '20px',
                  background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
                  color: '#92400e',
                  fontSize: '13px',
                  fontWeight: '700',
                }}>
                  {selectedProducts.length} Items
                </div>
              </div>

              {selectedProducts.length === 0 ? (
                <div style={{ 
                  textAlign: 'center', 
                  padding: '60px 20px',
                  background: 'linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)',
                  borderRadius: '12px',
                  border: '2px dashed #d1d5db',
                }}>
                  <div style={{ fontSize: '56px', marginBottom: '12px' }}>🛒</div>
                  <p style={{ fontSize: '16px', fontWeight: '600', color: '#6b7280', marginBottom: '4px' }}>
                    Cart is Empty
                  </p>
                  <p style={{ fontSize: '14px', color: '#9ca3af' }}>
                    Add products from the catalog above
                  </p>
                </div>
              ) : (
                <div style={{ 
                  maxHeight: '300px',
                  overflowY: 'auto',
                  borderRadius: '12px',
                  border: '2px solid #fef3c7',
                }}>
                  {selectedProducts.map((item, index) => (
                    <div
                      key={item.product}
                      style={{
                        padding: '16px',
                        borderBottom: index < selectedProducts.length - 1 ? '1px solid #fef3c7' : 'none',
                        backgroundColor: '#fff',
                        transition: 'all 0.2s ease',
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.backgroundColor = '#fffbeb';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.backgroundColor = '#fff';
                      }}
                    >
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        gap: '12px',
                      }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ 
                            fontWeight: '700', 
                            marginBottom: '12px',
                            color: '#111827',
                            fontSize: '15px',
                          }}>
                            {item.productName}
                          </div>
                          <div style={{ 
                            display: 'flex', 
                            gap: '8px', 
                            alignItems: 'center',
                            flexWrap: 'wrap',
                          }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <span style={{ fontSize: '12px', color: '#6b7280', fontWeight: '600' }}>Qty:</span>
                              <input
                                type="number"
                                value={item.quantity}
                                onChange={(e) => updateQuantity(item.product, parseInt(e.target.value))}
                                min="1"
                                max={item.maxQuantity}
                                style={{ 
                                  width: '70px',
                                  padding: '6px 8px',
                                  borderRadius: '6px',
                                  border: '2px solid #e5e7eb',
                                  fontSize: '14px',
                                  fontWeight: '600',
                                  textAlign: 'center',
                                }}
                              />
                            </div>
                            <span style={{ fontSize: '14px', color: '#9ca3af' }}>×</span>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <span style={{ fontSize: '12px', color: '#6b7280', fontWeight: '600' }}>₹</span>
                              <input
                                type="number"
                                value={item.sellingPrice}
                                onChange={(e) => updatePrice(item.product, e.target.value)}
                                min="0"
                                step="0.01"
                                style={{ 
                                  width: '90px',
                                  padding: '6px 8px',
                                  borderRadius: '6px',
                                  border: '2px solid #e5e7eb',
                                  fontSize: '14px',
                                  fontWeight: '600',
                                }}
                              />
                            </div>
                            <span style={{ 
                              fontSize: '15px', 
                              fontWeight: '700',
                              color: '#16a34a',
                              padding: '4px 8px',
                              borderRadius: '6px',
                              backgroundColor: '#dcfce7',
                            }}>
                              = ₹{(item.quantity * item.sellingPrice).toFixed(2)}
                            </span>
                          </div>
                        </div>
                        <Button
                          onClick={() => removeProduct(item.product)}
                          variant="danger"
                          size="small"
                          style={{ 
                            padding: '8px 12px',
                            fontSize: '12px',
                          }}
                        >
                          ✕
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>

          {/* Right: Checkout */}
          <div style={{ position: 'sticky', top: '20px' }}>
            <Card style={{ 
              background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
              color: '#fff',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
            }}>
              <h2 style={{ 
                fontSize: '22px', 
                fontWeight: '800', 
                marginBottom: '24px',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              }}>
                <span style={{ fontSize: '28px' }}>💳</span>
                Checkout
              </h2>

              <form onSubmit={handleSubmit}>
                {/* Customer Info */}
                <div style={{ 
                  marginBottom: '24px',
                  padding: '20px',
                  borderRadius: '12px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                }}>
                  <h3 style={{ 
                    fontSize: '14px', 
                    fontWeight: '700', 
                    marginBottom: '16px',
                    color: '#fbbf24',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}>
                    👤 Customer Details
                  </h3>
                  <Input
                    label="Customer Name"
                    value={customer.name}
                    onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                    placeholder="Walk-in Customer"
                    style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)' }}
                  />
                  <Input
                    label="Phone Number"
                    value={customer.phone}
                    onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                    placeholder="Optional"
                    style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)' }}
                  />
                </div>

                {/* Payment Method */}
                <div style={{ 
                  marginBottom: '24px',
                  padding: '20px',
                  borderRadius: '12px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                }}>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '12px', 
                    fontWeight: '700', 
                    fontSize: '14px',
                    color: '#fbbf24',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}>
                    💰 Payment Method
                  </label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      border: '2px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '600',
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      color: '#1f2937',
                    }}
                  >
                    <option value="cash">💵 Cash</option>
                    <option value="card">💳 Card</option>
                    <option value="upi">📱 UPI</option>
                    <option value="bank_transfer">🏦 Bank Transfer</option>
                  </select>
                </div>

                {/* Summary */}
                <div style={{
                  padding: '24px',
                  background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.2) 0%, rgba(245, 158, 11, 0.2) 100%)',
                  borderRadius: '16px',
                  marginBottom: '24px',
                  border: '2px solid rgba(251, 191, 36, 0.3)',
                  backdropFilter: 'blur(10px)',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '15px' }}>
                    <span style={{ color: '#e5e7eb' }}>Subtotal:</span>
                    <span style={{ fontWeight: '700', color: '#fff' }}>₹{subtotal.toFixed(2)}</span>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                    <div style={{ flex: 1 }}>
                      <input
                        type="number"
                        value={discount}
                        onChange={(e) => setDiscount(e.target.value)}
                        placeholder="Discount"
                        min="0"
                        step="0.01"
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          borderRadius: '8px',
                          border: '2px solid rgba(255, 255, 255, 0.2)',
                          fontSize: '14px',
                          fontWeight: '600',
                          backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        }}
                      />
                    </div>
                    <div style={{ flex: 1 }}>
                      <input
                        type="number"
                        value={tax}
                        onChange={(e) => setTax(e.target.value)}
                        placeholder="Tax/GST"
                        min="0"
                        step="0.01"
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          borderRadius: '8px',
                          border: '2px solid rgba(255, 255, 255, 0.2)',
                          fontSize: '14px',
                          fontWeight: '600',
                          backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        }}
                      />
                    </div>
                  </div>

                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    paddingTop: '16px',
                    borderTop: '2px solid rgba(255, 255, 255, 0.3)',
                    fontSize: '24px',
                    fontWeight: '900',
                  }}>
                    <span>TOTAL:</span>
                    <span style={{ 
                      background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}>
                      ₹{total.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Amount Paid */}
                <div style={{ marginBottom: '16px' }}>
                  <Input
                    label="Amount Paid"
                    type="number"
                    value={amountPaid}
                    onChange={(e) => setAmountPaid(e.target.value)}
                    placeholder={total.toFixed(2)}
                    min="0"
                    step="0.01"
                    style={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      fontSize: '16px',
                      fontWeight: '700',
                    }}
                  />
                </div>

                {balance !== 0 && (
                  <div style={{
                    padding: '16px',
                    marginBottom: '20px',
                    borderRadius: '12px',
                    background: balance > 0 
                      ? 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)' 
                      : 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)',
                    color: balance > 0 ? '#166534' : '#991b1b',
                    fontWeight: '800',
                    fontSize: '16px',
                    textAlign: 'center',
                    border: `2px solid ${balance > 0 ? '#86efac' : '#fca5a5'}`,
                  }}>
                    {balance > 0 ? '💵 Change to Return' : '⚠️ Balance Due'}: ₹{Math.abs(balance).toFixed(2)}
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={loading || selectedProducts.length === 0}
                  fullWidth
                  size="large"
                  style={{ 
                    background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                    fontSize: '18px',
                    fontWeight: '800',
                    padding: '16px',
                    borderRadius: '12px',
                    boxShadow: '0 8px 20px rgba(34, 197, 94, 0.4)',
                  }}
                >
                  {loading ? (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span className="spin" style={{ fontSize: '20px' }}>⏳</span>
                      Processing...
                    </span>
                  ) : (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '24px' }}>✨</span>
                      Complete Sale
                    </span>
                  )}
                </Button>
              </form>
            </Card>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccess && lastInvoice && (
        <Modal onClose={() => setShowSuccess(false)}>
          <div style={{ 
            textAlign: 'center', 
            padding: '40px 30px',
            background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
            borderRadius: '16px',
          }}>
            <div style={{ 
              fontSize: '80px', 
              marginBottom: '20px',
              animation: 'fadeIn 0.5s ease-out',
            }}>
              ✅
            </div>
            <h3 style={{ 
              fontSize: '28px', 
              fontWeight: '800', 
              marginBottom: '12px',
              color: '#166534',
            }}>
              Sale Completed!
            </h3>
            <p style={{ 
              fontSize: '16px', 
              color: '#6b7280', 
              marginBottom: '20px',
              fontWeight: '500',
            }}>
              Invoice: <strong style={{ 
                color: '#2563eb',
                fontSize: '18px',
                padding: '4px 12px',
                borderRadius: '6px',
                backgroundColor: '#dbeafe',
              }}>
                {lastInvoice.invoiceNumber}
              </strong>
            </p>
            <div style={{ 
              padding: '20px',
              borderRadius: '12px',
              backgroundColor: '#fff',
              marginBottom: '28px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            }}>
              <div style={{ 
                fontSize: '14px', 
                color: '#6b7280', 
                marginBottom: '8px',
                fontWeight: '600',
              }}>
                Total Amount
              </div>
              <div style={{ 
                fontSize: '36px', 
                fontWeight: '900',
                background: 'linear-gradient(135deg, #16a34a 0%, #22c55e 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
                ₹{lastInvoice.totalAmount.toFixed(2)}
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <Button 
                onClick={() => setShowSuccess(false)} 
                variant="outline" 
                size="large"
                style={{ minWidth: '150px' }}
              >
                🛒 New Sale
              </Button>
              <Button 
                onClick={() => window.print()} 
                variant="success"
                size="large"
                style={{ minWidth: '150px' }}
              >
                🖨️ Print Receipt
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </DashboardLayout>
  );
}
