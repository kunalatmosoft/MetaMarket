// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract PredictionMarket {
    address public owner;
    uint256 public marketCount;
    uint256 constant FEE_PERCENTAGE = 2;
    uint256 constant MIN_LIQUIDITY = 0.0001 ether;

    struct Market {
        uint256 id;
        address creator;
        bytes metadata; // Encoded JSON with question, description, category, resolutionSource
        uint256 resolutionDate;
        uint256 initialLiquidity;
        bool resolved;
        bool outcome;
        uint256 yesShares;
        uint256 noShares;
        bool active;
    }

    mapping(uint256 => Market) public markets;
    mapping(uint256 => mapping(address => uint256)) public yesBets;
    mapping(uint256 => mapping(address => uint256)) public noBets;

    event MarketCreated(
        uint256 indexed marketId,
        address indexed creator,
        uint256 resolutionDate
    );
    event BetPlaced(uint256 indexed marketId, address indexed bettor, bool outcome, uint256 amount);
    event MarketResolved(uint256 indexed marketId, bool outcome);
    event PayoutClaimed(uint256 indexed marketId, address indexed bettor, uint256 amount);

    modifier onlyCreator(uint256 _marketId) {
        require(msg.sender == markets[_marketId].creator, "Only creator can perform this action");
        _;
    }

    modifier marketExists(uint256 _marketId) {
        require(_marketId <= marketCount && _marketId > 0, "Market does not exist");
        _;
    }

    modifier marketNotResolved(uint256 _marketId) {
        require(!markets[_marketId].resolved, "Market already resolved");
        _;
    }

    constructor() {
        owner = msg.sender;
        marketCount = 0;
    }

    function createMarket(
        bytes memory _metadata, // Encoded JSON
        uint256 _resolutionDate
    ) external payable {
        require(_metadata.length > 0, "Metadata cannot be empty");
        require(_resolutionDate > block.timestamp, "Resolution date must be in the future");
        require(msg.value >= MIN_LIQUIDITY, "Initial liquidity must be at least 0.1 ETH");

        marketCount++;
        Market storage newMarket = markets[marketCount];
        newMarket.id = marketCount;
        newMarket.creator = msg.sender;
        newMarket.metadata = _metadata;
        newMarket.resolutionDate = _resolutionDate;
        newMarket.initialLiquidity = msg.value;
        newMarket.yesShares = msg.value / 2;
        newMarket.noShares = msg.value / 2;
        newMarket.active = true;

        emit MarketCreated(marketCount, msg.sender, _resolutionDate);
    }

    function placeBet(uint256 _marketId, bool _outcome) external payable marketExists(_marketId) marketNotResolved(_marketId) {
        Market storage market = markets[_marketId];
        require(market.active, "Market is not active");
        require(block.timestamp < market.resolutionDate, "Market has expired");
        require(msg.value > 0, "Bet amount must be greater than zero");

        if (_outcome) {
            market.yesShares += msg.value;
            yesBets[_marketId][msg.sender] += msg.value;
        } else {
            market.noShares += msg.value;
            noBets[_marketId][msg.sender] += msg.value;
        }

        emit BetPlaced(_marketId, msg.sender, _outcome, msg.value);
    }

    function resolveMarket(uint256 _marketId, bool _outcome) external onlyCreator(_marketId) marketExists(_marketId) marketNotResolved(_marketId) {
        Market storage market = markets[_marketId];
        require(block.timestamp >= market.resolutionDate, "Resolution date not reached");

        market.resolved = true;
        market.outcome = _outcome;
        market.active = false;

        emit MarketResolved(_marketId, _outcome);
    }

    function claimPayout(uint256 _marketId) external marketExists(_marketId) {
        Market storage market = markets[_marketId];
        require(market.resolved, "Market not resolved");

        uint256 userBet = market.outcome ? yesBets[_marketId][msg.sender] : noBets[_marketId][msg.sender];
        require(userBet > 0, "No winning bet to claim");

        uint256 totalWinningShares = market.outcome ? market.yesShares : market.noShares;
        uint256 totalPool = market.yesShares + market.noShares;
        uint256 payout = (userBet * totalPool) / totalWinningShares;
        uint256 fee = (payout * FEE_PERCENTAGE) / 100;
        uint256 payoutAfterFee = payout - fee;

        if (market.outcome) {
            yesBets[_marketId][msg.sender] = 0;
        } else {
            noBets[_marketId][msg.sender] = 0;
        }

        payable(owner).transfer(fee);
        payable(msg.sender).transfer(payoutAfterFee);

        emit PayoutClaimed(_marketId, msg.sender, payoutAfterFee);
    }

    function getMarketMetadata(uint256 _marketId) external view marketExists(_marketId) returns (
        address creator,
        bytes memory metadata
    ) {
        Market storage market = markets[_marketId];
        return (market.creator, market.metadata);
    }

    function getMarketStatus(uint256 _marketId) external view marketExists(_marketId) returns (
        uint256 resolutionDate,
        uint256 initialLiquidity,
        bool resolved,
        bool outcome,
        bool active
    ) {
        Market storage market = markets[_marketId];
        return (
            market.resolutionDate,
            market.initialLiquidity,
            market.resolved,
            market.outcome,
            market.active
        );
    }

    function getMarketShares(uint256 _marketId) external view marketExists(_marketId) returns (
        uint256 yesShares,
        uint256 noShares
    ) {
        Market storage market = markets[_marketId];
        return (market.yesShares, market.noShares);
    }

    function getUserBets(uint256 _marketId, address _user) external view marketExists(_marketId) returns (
        uint256 yesBet,
        uint256 noBet
    ) {
        return (yesBets[_marketId][_user], noBets[_marketId][_user]);
    }
}