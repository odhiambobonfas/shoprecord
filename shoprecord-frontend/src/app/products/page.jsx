'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import DashboardLayout from '../../components/layout/DashboardLayout.component';
import ProductTable from '../../components/products/ProductTable.component';
import SearchBar from '../../components/ui/SearchBar.ui';
import Pagination from '../../components/ui/Pagination.ui';
import Button from '../../components/ui/Button.ui';
import Loading from '../../components/ui/Loading.ui';
import Alert from '../../components/ui/Alert.ui';
import productService from '../../services/productService.service';
import { filterProducts, paginate } from '../../utils/helpers.utils';
import { ITEMS_PER_PAGE } from '../../utils/constants.utils';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    const filtered = filterProducts(products, searchTerm);
    setFilteredProducts(filtered);
    setCurrentPage(1); // Reset to first page on search
  }, [searchTerm, products]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await productService.getProducts();
      setProducts(data.products || data || []);
    } catch (err) {
      setError('Failed to load products');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await productService.deleteProduct(id);
      setSuccessMessage('Product deleted successfully');
      fetchProducts();
    } catch (err) {
      setError('Failed to delete product');
      console.error(err);
    }
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const paginatedProducts = paginate(filteredProducts, currentPage, ITEMS_PER_PAGE);
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);

  const headerStyles = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
  };

  const titleStyles = {
    fontSize: '22px',
    fontWeight: '700',
    color: '#111827',
  };

  const toolbarStyles = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
    gap: '16px',
  };

  if (loading) {
    return (
      <DashboardLayout>
        <Loading message="Loading products..." />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div style={headerStyles}>
        <h1 style={titleStyles}>Products</h1>
        <Link href="/products/new">
          <Button>+ Add New Product</Button>
        </Link>
      </div>

      {error && (
        <Alert type="error" message={error} onClose={() => setError('')} />
      )}

      {successMessage && (
        <Alert
          type="success"
          message={successMessage}
          onClose={() => setSuccessMessage('')}
        />
      )}

      <div style={toolbarStyles}>
        <SearchBar
          onSearch={handleSearch}
          placeholder="Search products by name, category, or description..."
        />
      </div>

      <ProductTable products={paginatedProducts} onDelete={handleDelete} />

      {filteredProducts.length > ITEMS_PER_PAGE && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          itemsPerPage={ITEMS_PER_PAGE}
          totalItems={filteredProducts.length}
        />
      )}
    </DashboardLayout>
  );
}
