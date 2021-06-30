const express = require('express');
const router = express.Router();

const teamsController = require('../controllers/teams');
const leaguesController = require('../controllers/leagues');
const statsController = require('../controllers/stats');
const adminController = require('../controllers/admin');
const tableController = require('../controllers/table');

router.get('/get-teams/:id', teamsController.getTeams);
router.get('/get-team/:id', teamsController.getTeam);
router.get('/get-market-value/:id', teamsController.getMarketValue);

router.post('/get-data', tableController.getData);
router.post('/filter', tableController.filter);
router.post('/sort', tableController.sort);
router.post('/sort-filtered', tableController.sortFiltered);

router.get('/get-leagues', leaguesController.getLeagues);

router.post('/get-stats', statsController.getStats)

router.post('/add-player', adminController.addPlayer);
router.post('/edit-player', adminController.updatePlayer);
router.post('/delete-player/:id', adminController.deletePlayer);

module.exports = router;