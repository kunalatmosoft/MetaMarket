// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Crowdfunding {
    struct Campaign {
        address payable creator;
        string title;
        string description;
        uint256 goal;
        uint256 deadline;
        uint256 amountRaised;
        bool completed;
        mapping(address => uint256) contributions;
    }

    uint256 public campaignCount;
    mapping(uint256 => Campaign) public campaigns;

    event CampaignCreated(uint256 id, address creator, string title, uint256 goal, uint256 deadline);
    event ContributionMade(uint256 campaignId, address contributor, uint256 amount);
    event CampaignCompleted(uint256 campaignId, uint256 amountRaised);
    event RefundIssued(uint256 campaignId, address contributor, uint256 amount);

    function createCampaign(string memory _title, string memory _description, uint256 _goal, uint256 _duration) public {
        require(_goal > 0, "Goal must be greater than 0");
        require(_duration > 0, "Duration must be greater than 0");

        campaignCount++;
        Campaign storage campaign = campaigns[campaignCount];
        campaign.creator = payable(msg.sender);
        campaign.title = _title;
        campaign.description = _description;
        campaign.goal = _goal;
        campaign.deadline = block.timestamp + _duration;
        campaign.amountRaised = 0;
        campaign.completed = false;

        emit CampaignCreated(campaignCount, msg.sender, _title, _goal, campaign.deadline);
    }

    function contribute(uint256 _campaignId) public payable {
        Campaign storage campaign = campaigns[_campaignId];
        require(block.timestamp < campaign.deadline, "Campaign has ended");
        require(!campaign.completed, "Campaign is completed");
        require(msg.value > 0, "Contribution must be greater than 0");

        campaign.contributions[msg.sender] += msg.value;
        campaign.amountRaised += msg.value;

        emit ContributionMade(_campaignId, msg.sender, msg.value);

        if (campaign.amountRaised >= campaign.goal) {
            campaign.completed = true;
            campaign.creator.transfer(campaign.amountRaised);
            emit CampaignCompleted(_campaignId, campaign.amountRaised);
        }
    }

    function refund(uint256 _campaignId) public {
        Campaign storage campaign = campaigns[_campaignId];
        require(block.timestamp >= campaign.deadline, "Campaign is still active");
        require(!campaign.completed, "Campaign is completed");
        require(campaign.contributions[msg.sender] > 0, "No contribution found");

        uint256 amount = campaign.contributions[msg.sender];
        campaign.contributions[msg.sender] = 0;
        campaign.amountRaised -= amount;
        payable(msg.sender).transfer(amount);

        emit RefundIssued(_campaignId, msg.sender, amount);
    }

    function getCampaignDetails(uint256 _campaignId) public view returns (
        address creator,
        string memory title,
        string memory description,
        uint256 goal,
        uint256 deadline,
        uint256 amountRaised,
        bool completed
    ) {
        Campaign storage campaign = campaigns[_campaignId];
        return (
            campaign.creator,
            campaign.title,
            campaign.description,
            campaign.goal,
            campaign.deadline,
            campaign.amountRaised,
            campaign.completed
        );
    }
}