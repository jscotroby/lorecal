import ACTIONS from './actions';
import {get, post} from './helper';
import history from '../../history';

export const getMyCampaigns = () =>
    (dispatch, getState) => {
        let userId = getState().session.currentUserId;
        Promise.all([
            get('campaign/dm/' + userId)
                .then(campaigns => {
                    dispatch({
                        type: ACTIONS.GET_CAMPAIGNS,
                        payload: campaigns
                    })
                }),
            get('campaign/player/' + userId)
                .then(campaigns => {
                    dispatch({
                        type: ACTIONS.GET_CAMPAIGNS,
                        payload: campaigns
                    })
                })
        ])
    };

export const createCampaign = (campaignData) =>
    dispatch =>
        post('campaign', campaignData)
            .then(campaign => {
                dispatch({
                    type: ACTIONS.CREATE_CAMPAIGN,
                    payload: campaign
                });
                history.push('/campaign/' + campaign.id);
            });

export const getCampaignLore = (campaignId) =>
    dispatch => get('campaign/' + campaignId + '/lore')
        .then(lore =>
            dispatch({
                type: ACTIONS.GET_CAMPAIGN_LORE,
                payload: {
                    campaignId,
                    lore
                }
            })
        );

export const processImage = (campaignId, image) =>
    dispatch =>
        post('campaign/' + campaignId + '/lore/process', {image})
            .then(lore => {
                dispatch({
                    type: ACTIONS.GET_CAMPAIGN_LORE,
                    payload: {
                        campaignId,
                        lore
                    }
                })
            })
