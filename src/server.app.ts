import { json, urlencoded } from 'body-parser';
import express from 'express';
import { Request, Response, NextFunction } from 'express';
import morgan from 'morgan';
import ResponseHandler from './util/response-handler';
import appRoutes from './util/use-routes';

const app = express();

app.use(morgan('combined'));

app.use(urlencoded({ extended: true }));
app.use(json());

app.disable('x-powered-by');

appRoutes(app);

app.get('/', async (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'Welcome to Short URL API',
  });
});

app.use((req: Request, res: Response) => {
  return ResponseHandler.sendErrorResponse({ res, status: 404, error: 'Route not found' });
});

app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  return ResponseHandler.sendFatalErrorResponse({ res, error });
});

export default app;
