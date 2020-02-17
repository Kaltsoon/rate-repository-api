const oneHour = 1000 * 60 * 60;

const createDateColumns = date => ({
  created_at: date,
  updated_at: date,
});

exports.seed = async knex => {
  await knex('repositories').del();

  await knex('repositories').insert([
    {
      id: 'jaredpalmer/formik',
      owner_name: 'jaredpalmer',
      name: 'formik',
      ...createDateColumns(new Date(Date.now() - oneHour)),
    },
    {
      id: 'async-library/react-async',
      owner_name: 'async-library',
      name: 'react-async',
      ...createDateColumns(new Date(Date.now() - 2 * oneHour)),
    },
    {
      id: 'rzwitserloot/lombok',
      owner_name: 'rzwitserloot',
      name: 'lombok',
      ...createDateColumns(new Date(Date.now() - 3 * oneHour)),
    },
    {
      id: 'rails/rails',
      owner_name: 'rails',
      name: 'rails',
      ...createDateColumns(new Date(Date.now() - 4 * oneHour)),
    },
    {
      id: 'django/django',
      owner_name: 'django',
      name: 'django',
      ...createDateColumns(new Date(Date.now() - 5 * oneHour)),
    },
  ]);
};
