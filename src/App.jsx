/* eslint-disable jsx-a11y/accessible-emoji */
import React, { useState } from 'react';
import './App.scss';

import usersFromServer from './api/users';
import categoriesFromServer from './api/categories';
import productsFromServer from './api/products';
import classNames from 'classnames';

const products = productsFromServer.map(product => {
  const category = categoriesFromServer.find(
    cat => cat.id === product.categoryId,
  );
  const user = usersFromServer.find(usr => usr.id === category.ownerId);

  return {
    ...product,
    category,
    user,
  };
});

export const App = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [query, setQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [productsList] = useState(products);
  const [sortColumn, setSortColumn] = useState(null);

  const filteredProducts = productsList.filter(({ user, name, category }) => {
    const matchesUser = !selectedUser || user.id === selectedUser.id;
    const matchesQuery = name
      .toLowerCase()
      .includes(query.trim().toLowerCase());
    const matchesCategory =
      selectedCategories.length === 0 ||
      selectedCategories.includes(category.id);

    return matchesUser && matchesQuery && matchesCategory;
  });

  const handleResetAllFilters = () => {
    setSelectedUser(null);
    setQuery('');
    setSelectedCategories([]);
  };

  const toggleCategorySelection = categoryId => {
    setSelectedCategories(prevCategories => {
      if (prevCategories.includes(categoryId)) {
        return prevCategories.filter(id => id !== categoryId);
      } else {
        return [...prevCategories, categoryId];
      }
    });
  };

  const sortProducts = column => {
    if (column !== sortColumn) {
      setSortColumn(null);
    }

    const sortedProducts = [...filteredProducts];

    sortedProducts.sort((a, b) => {
      let comparison = 0;
      switch (column) {
        case 'id':
          comparison = a.id - b.id;
          break;
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'category':
          comparison = a.category.title.localeCompare(b.category.title);
          break;
        case 'user':
          comparison = a.user.name.localeCompare(b.user.name);
          break;
        default:
          break;
      }

      if (sortColumn === column) {
        comparison = comparison * -1;
      }

      return comparison;
    });

    setSortColumn(column);
  };

  return (
    <div className="section">
      <div className="container">
        <h1 className="title">Product Categories</h1>

        <div className="block">
          <nav className="panel">
            <p className="panel-heading">Filters</p>

            <p className="panel-tabs has-text-weight-bold">
              <a
                data-cy="FilterAllUsers"
                href="#/"
                onClick={() => setSelectedUser(null)}
                className={classNames({ 'is-active': !selectedUser })}
              >
                All
              </a>
              {usersFromServer.map(user => (
                <a
                  key={user.id}
                  data-cy="FilterUser"
                  href="#/"
                  onClick={() => setSelectedUser(user)}
                  className={classNames({
                    'is-active': selectedUser && selectedUser.id === user.id,
                  })}
                >
                  {user.name}
                </a>
              ))}
            </p>

            <div className="panel-block">
              <p className="control has-icons-left has-icons-right">
                <input
                  data-cy="SearchField"
                  type="text"
                  className="input"
                  placeholder="Search"
                  value={query}
                  onChange={e => setQuery(e.target.value.trimStart())}
                />
                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>
                {query && (
                  <span className="icon is-right">
                    <button
                      data-cy="ClearButton"
                      type="button"
                      className="delete"
                      onClick={() => setQuery('')}
                    />
                  </span>
                )}
              </p>
            </div>

            <div className="panel-block is-flex-wrap-wrap">
              <a
                href="#/"
                data-cy="AllCategories"
                className={classNames('button', 'is-success', 'mr-6', {
                  'is-outlined':
                    selectedCategories.length &&
                    categoriesFromServer.length !== selectedCategories.length,
                })}
                onClick={() => setSelectedCategories([])}
              >
                All
              </a>
              {categoriesFromServer.map(category => (
                <a
                  key={category.id}
                  href="#/"
                  data-cy="Category"
                  className={classNames('button', 'mr-2', 'my-1', {
                    'is-info': selectedCategories.includes(category.id),
                  })}
                  onClick={() => toggleCategorySelection(category.id)}
                >
                  {category.title}
                </a>
              ))}
            </div>

            <div className="panel-block">
              <a
                data-cy="ResetAllButton"
                href="#/"
                className="button is-link is-outlined is-fullwidth"
                onClick={handleResetAllFilters}
              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        <div className="box table-container">
          {filteredProducts.length === 0 ? (
            <p data-cy="NoMatchingMessage">
              No products matching selected criteria
            </p>
          ) : (
            <table
              data-cy="ProductTable"
              className="table is-striped is-narrow is-fullwidth"
            >
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Product</th>
                  <th>Category</th>
                  <th>User</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map(product => (
                  <tr key={product.id} data-cy="Product">
                    <td className="has-text-weight-bold" data-cy="ProductId">
                      {product.id}
                    </td>
                    <td data-cy="ProductName">{product.name}</td>
                    <td data-cy="ProductCategory">
                      {product.category.icon} - {product.category.title}
                    </td>
                    <td
                      data-cy="ProductUser"
                      className={classNames({
                        'has-text-link': product.user.sex === 'm',
                        'has-text-danger': product.user.sex === 'f',
                      })}
                    >
                      {product.user.name}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
