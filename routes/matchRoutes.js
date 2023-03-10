/* eslint-disable import/extensions */
import { Router } from 'express';
import homeController from '../controllers/HomeController.js';
import teamsController from '../controllers/TeamsController.js';
import matchController from '../controllers/MatchController.js';
const routes = new Router();

// routes.get('/', teamsController.index);
// routes.get('/show/:id', teamsController.searchTeam);
// routes.post('/create', teamsController.createTeam);
// routes.put('/update/:id', teamsController.updateTeam);
// routes.delete('/delete/:id', teamsController.deleteTeam);

routes.post('/', matchController.createMatch)
routes.put('/result/:id', matchController.resultMatch)
routes.get('/searchmatch/:id', matchController.searchMatch)

export default routes;
