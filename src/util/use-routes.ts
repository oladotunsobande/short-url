import express from 'express';
import link from '../routes';

const appRoutes = (app: express.Application): void => {
  app.use('/link', link)
};

export default appRoutes;