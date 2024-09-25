/* eslint-disable jsx-a11y/accessible-emoji */
import React, { useState } from 'react';
import './App.scss';

import usersFromServer from './api/users';
import categoriesFromServer from './api/categories';
import productsFromServer from './api/products';
import classNames from 'classnames';

const products = productsFromServer.map(product => {
  const category =
    categoriesFromServer.find(category => category.id === product.categoryId) ||
    null;
  const user =
    usersFromServer.find(person => person.id === category.ownerId) || null;

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

  const handleResetAllFilters = () => {
    setSelectedUser(null);
    setQuery('');
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
                className={classNames({
                  'is-active': selectedUser === null,
                })}
                onClick={() => setSelectedUserId(null)}
              >
                All
              </a>

              {usersFromServer.map(user => (
                <a
                  key={user.id}
                  data-cy="FilterUser"
                  href="#/"
                  className={classNames({
                    'is-active': user.id === selectedUser,
                  })}
                  onClick={() => setSelectedUser(user.id)}
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
                  onChange={event => setQuery(event.target.value.trimStart())}
                />

                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>

                {query && (
                  <span className="icon is-right">
                    {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
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
                className={classNames('button is-success mr-6', {
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
                  data-cy="Category"
                  className={classNames('button mr-2 my-1', {
                    'is-info': isCategorySelected(category.id),
                  })}
                  href="#/"
                  onClick={() => handleToggleCategory(category.id)}
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
                  {['ID', 'Product', 'Category', 'User'].map(columnName => (
                    <th key={columnName}>
                      <span className="is-flex is-flex-wrap-nowrap">
                        {columnName}
                        <a href="#/" onClick={() => handleSort(columnName)}>
                          <span className="icon">
                            <i
                              data-cy="SortIcon"
                              className={classNames('fas', {
                                'fa-sort': sort.by !== columnName,
                                'fa-sort-down':
                                  sort.by === columnName &&
                                  sort.order === 'desc',
                                'fa-sort-up':
                                  sort.by === columnName &&
                                  sort.order === 'asc',
                              })}
                            />
                          </span>
                        </a>
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {filteredProducts.map(({ category, user, ...product }) => (
                  <tr data-cy="Product" key={product.id}>
                    <td className="has-text-weight-bold" data-cy="ProductId">
                      {product.id}
                    </td>

                    <td data-cy="ProductName">{product.name}</td>
                    <td data-cy="ProductCategory">
                      {category.icon} - {category.title}
                    </td>

                    <td
                      data-cy="ProductUser"
                      className={
                        user.sex === 'm' ? 'has-text-link' : 'has-text-danger'
                      }
                    >
                      {user.name}
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
