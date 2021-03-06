const knex = require('../connection');
const DaoFactory = require('./DaoFactory');
const TABLES = require('../tables');
const COLUMNS = require('../columns');
const TO_MANY = require('../toMany');
const TO_ONE = require('../toOne');

const Campaign = DaoFactory(
    (campaign) => {
        this.id = campaign.id;
        this.title = campaign.title;
        this.description = campaign.description;
        this.dm_id = campaign.dm_id;
    },
    TABLES.CAMPAIGNS
);

Campaign.find = (campaignFilter) => {
    return knex(TABLES.CAMPAIGNS)
        .where(Campaign.applyTableName(campaignFilter))
        .leftJoin(TABLES.CAMPAIGN_PLAYERS, `${TABLES.CAMPAIGN_PLAYERS}.${COLUMNS.CAMPAIGN_PLAYERS.CAMPAIGN_ID}`, `${TABLES.CAMPAIGNS}.${COLUMNS.DEFAULT.ID}`)
        .leftJoin(`${TABLES.USERS} as ${TO_MANY.CAMPAIGNS.PLAYERS}`, `${TABLES.CAMPAIGN_PLAYERS}.${COLUMNS.CAMPAIGN_PLAYERS.PLAYER_ID}`, `${TO_MANY.CAMPAIGNS.PLAYERS}.${COLUMNS.DEFAULT.ID}`)
        .leftJoin(`${TABLES.USERS} as ${TO_ONE.CAMPAIGNS.DM}`, `${TABLES.CAMPAIGNS}.${COLUMNS.CAMPAIGNS.DM_ID}`, `${TO_ONE.CAMPAIGNS.DM}.${COLUMNS.DEFAULT.ID}`)
        .options({ nestTables: true })
        .then(Campaign.reduceJoins);
};

Campaign.addPlayer = (campaignId, playerId) => {
    return knex(TABLES.CAMPAIGN_PLAYERS)
        .insert({
            [COLUMNS.CAMPAIGN_PLAYERS.CAMPAIGN_ID]: campaignId,
            [COLUMNS.CAMPAIGN_PLAYERS.PLAYER_ID]: playerId
        })
        .then(() => Campaign.find({[COLUMNS.DEFAULT.ID]: campaignId}));
};

Campaign.removePlayer = (campaignId, playerId) => {
    return knex(TABLES.CAMPAIGN_PLAYERS)
        .where({
            [COLUMNS.CAMPAIGN_PLAYERS.CAMPAIGN_ID]: campaignId,
            [COLUMNS.CAMPAIGN_PLAYERS.PLAYER_ID]: playerId
        })
        .delete()
        .then(() => Campaign.find({[COLUMNS.DEFAULT.ID]: campaignId}));
};

module.exports = Campaign;