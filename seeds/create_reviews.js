const oneHour = 1000 * 60 * 60;

const createDateColumns = date => ({
  created_at: date,
  updated_at: date,
});

const kalleId = 'bbe42984-051b-4a01-b45d-b8d29c32200c';
const elinaId = 'cff8872a-8ff5-4092-ac2f-d79e65f18aa2';
const mattiId = '1b10e4d8-57ee-4d00-8886-e4a049d7ff8f';

const formikId = 'jaredpalmer/formik';
const reactAsyncId = 'async-library/react-async';

const createReviewId = (userId, repositoryId) =>
  [userId, repositoryId].join('.');

const createIdColumns = (userId, repositoryId) => ({
  id: createReviewId(userId, repositoryId),
  user_id: userId,
  repository_id: repositoryId,
});

exports.seed = async knex => {
  await knex('reviews').del();

  await knex('reviews').insert([
    {
      rating: 95,
      text:
        'In my opinion the best form library for React out there with an amazing hook API! Only downside is that big forms suffer from performance issues.',
      ...createIdColumns(kalleId, formikId),
      ...createDateColumns(new Date(Date.now() - oneHour)),
    },
    {
      rating: 85,
      text:
        'A very good React hook library for async operations, such as network requests. Could use better cache and suspense support.',
      ...createIdColumns(kalleId, reactAsyncId),
      ...createDateColumns(new Date(Date.now() - oneHour)),
    },
    {
      rating: 70,
      text:
        'A pretty good form library for React, but in my opinion redux-form is much more suitable for redux projects.',
      ...createIdColumns(mattiId, formikId),
      ...createDateColumns(new Date(Date.now() - 2 * oneHour)),
    },
    {
      rating: 75,
      text:
        'A quite usable library, however data fetching is much more easier with react-apollo, if you have a GraphQL API.',
      ...createIdColumns(elinaId, reactAsyncId),
      ...createDateColumns(new Date(Date.now() - 3 * oneHour)),
    },
  ]);
};
