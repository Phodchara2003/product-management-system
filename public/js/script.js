document.addEventListener('DOMContentLoaded', function() {
    const addProductForm = document.getElementById('addProductForm');
    const editProductForm = document.getElementById('editProductForm');
    const searchForm = document.getElementById('searchForm');

    if (addProductForm) {
        addProductForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const formData = new FormData(addProductForm);
            fetch('/api/products', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('Product added successfully!');
                    window.location.reload();
                } else {
                    alert('Error adding product: ' + data.message);
                }
            })
            .catch(error => console.error('Error:', error));
        });
    }

    if (editProductForm) {
        editProductForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const formData = new FormData(editProductForm);
            const productId = editProductForm.dataset.productId;
            fetch(`/api/products/${productId}`, {
                method: 'PUT',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('Product updated successfully!');
                    window.location.href = '/products';
                } else {
                    alert('Error updating product: ' + data.message);
                }
            })
            .catch(error => console.error('Error:', error));
        });
    }

    if (searchForm) {
        searchForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const searchQuery = document.getElementById('searchQuery').value;
            fetch(`/api/products/search?query=${searchQuery}`)
            .then(response => response.json())
            .then(data => {
                const resultsContainer = document.getElementById('searchResults');
                resultsContainer.innerHTML = '';
                if (data.products.length > 0) {
                    data.products.forEach(product => {
                        const productElement = document.createElement('div');
                        productElement.innerHTML = `<h3>${product.productName}</h3><p>Price: ${product.price}</p>`;
                        resultsContainer.appendChild(productElement);
                    });
                } else {
                    resultsContainer.innerHTML = '<p>No products found.</p>';
                }
            })
            .catch(error => console.error('Error:', error));
        });
    }
});