/* PIECE 0 */
const TraderDetailModal = {
  popupSelector: ".pricing-popup-main:not(.creator-popup-main)",
  popupClass: "pricing-popup-main",
  generateMatchRows: function (matchHistory, leagueId) {
    if (
      !matchHistory ||
      !Array.isArray(matchHistory) ||
      matchHistory.length === 0
    ) {
      return "";
    }

    return matchHistory
      .map((m, idx) => {
        const matchNum =
          typeof m.match === "number"
            ? `M${m.match}`
            : m.match || `M${idx + 1}`;
        const oppName = m.opponent || "Opponent";
        const oppColor =
          m.color ||
          (idx === 0
            ? "blue"
            : idx === 1
              ? "purple"
              : idx === 2
                ? "pink"
                : idx === 3
                  ? "green"
                  : idx === 4
                    ? "yellow"
                    : "burgundy");

        let resultClass = "";
        let resultText = m.result_label || m.result || "Won";
        const resLower = String(m.result || "").toLowerCase();

        const isInProgress =
          resLower.includes("progress") || resLower === "in_progress";

        if (isInProgress) {
          resultClass = "";
          resultText = "• In progress";
        } else if (resLower === "won" || resLower === "win") {
          resultClass = "won";
          resultText = "Won";
        } else if (resLower === "lost" || resLower === "loss") {
          resultClass = "lost";
          resultText = "Lost";
        } else if (resLower === "draw" || resLower === "drawn") {
          resultClass = "drawn";
          resultText = "Draw";
        }

        const userBalRaw =
          m.user_final_balance !== undefined && m.user_final_balance !== null
            ? m.user_final_balance
            : m.user_balance !== undefined
              ? m.user_balance
              : 50000;
        const userBalNum =
          typeof userBalRaw === "number"
            ? userBalRaw
            : parseFloat(String(userBalRaw).replace(/[$,+]/g, "")) || 0;
        const userBalPositive = userBalNum >= 0;
        const userBal = `${userBalPositive ? "+" : "-"}$${Math.abs(
          userBalNum,
        ).toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`;

        const oppBalRaw =
          m.opponent_final_balance !== undefined &&
          m.opponent_final_balance !== null
            ? m.opponent_final_balance
            : m.opponent_balance !== undefined
              ? m.opponent_balance
              : 50000;
        const oppBalNum =
          typeof oppBalRaw === "number"
            ? oppBalRaw
            : parseFloat(String(oppBalRaw).replace(/[$,+]/g, "")) || 0;
        const oppBalPositive = oppBalNum >= 0;
        const oppBal = `${oppBalPositive ? "+" : "-"}$${Math.abs(
          oppBalNum,
        ).toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`;
        const compareBalances = ["open1", "open2", "creator_league_2"].includes(leagueId);
        const userBalColor = compareBalances
          ? userBalNum === oppBalNum
            ? "#8b8582"
            : userBalNum < oppBalNum ? "#ef4444" : "#03dc5d"
          : userBalPositive ? "#03dc5d" : "#ef4444";
        const oppBalColor = compareBalances
          ? "#8b8582"
          : oppBalPositive ? "#8b8582" : "#ab623e";
        let ptsRaw =
          m.points !== undefined && m.points !== null
            ? m.points
            : m.pts !== undefined && m.pts !== null
              ? m.pts
              : 0;
        let ptsNum =
          typeof ptsRaw === "number"
            ? ptsRaw
            : parseFloat(String(ptsRaw).replace(/[^\d.-]/g, ""));
        if (isNaN(ptsNum)) ptsNum = 0;
        const ptsPositive = ptsNum >= 0;
        let pts;
        if (
          typeof ptsRaw === "string" &&
          (ptsRaw.toLowerCase().includes("pts") ||
            ptsRaw.toLowerCase().includes("pt"))
        ) {
          pts = ptsRaw;
        } else {
          pts = `${ptsPositive ? "+" : ""}${ptsNum} pts`;
        }

        return `
<div class="creators-table-row track-tb-row ${isInProgress ? "is-in-progress in-progress" : ""}">
<div class="creators-table-col match"><div class="creators-table-box track-table"><div class="creators-table-box-rank gray-col">${escapeHtml(matchNum)}</div></div></div>
<div class="creators-table-col opponent"><div class="creators-table-box track-table"><div class="oppnt-box"><div class="oppnt-crcl ${oppColor}"></div><div class="creators-table-box-count track-table">${escapeHtml(oppName)}</div></div></div></div>
<div class="creators-table-col result"><div class="creators-table-box track-table"><div class="in-progs ${resultClass}"><div class="in-progs-txt">${escapeHtml(resultText)}</div></div></div></div>
<div class="creators-table-col finals"><div class="creators-table-box track-table rgt"><div class="creators-table-box-count fnl-track-table"><span class="fnl-bal-left" style="color: ${userBalColor};">${escapeHtml(userBal)}</span> <span class="fnl-bal-left-mid">vs</span> <span class="fnl-bal-rgt" style="color: ${oppBalColor};">${escapeHtml(oppBal)}</span></div></div></div>
<div class="creators-table-col final-points"><div class="creators-table-box track-table rgt"><div class="creators-table-box-count points-track-table ${!ptsPositive ? "red" : ""}" style="${!ptsPositive ? "color: #ef4444;" : ""}">${escapeHtml(pts)}</div></div></div>
</div>
`;
      })
      .join("");
  },

  renderLoading: function () {
    return `
<div class="pricing-popup-wrp" style="min-width: 360px; max-width: 500px; margin: 0 auto;">
<div class="pricing-popup-top" style="display: flex; justify-content: flex-end; padding-bottom: 0;">
<div class="pricing-popup-top-rgt">
<div class="plt-close-btn" title="Close modal">
<img src="https://cdn.prod.website-files.com/679b064a680c614548672a06/6aabe63ef90ae5b44195b877_cross-ico.svg" loading="lazy" alt="Close" class="plt-close-btn-ico">
</div>
</div>
</div>
<div class="pricing-popup-loading-state" style="display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; margin: 0 auto; width: 100%; min-height: 240px; box-sizing: border-box;">
<div class="ptl-spinner" style="margin: 0 auto 16px;"></div>
<div class="loading-text" style="text-align: center; width: 100%;">Loading trader details...</div>
</div>
</div>
`;
  },

  renderError: function (message) {
    return `
<div class="pricing-popup-wrp" style="min-width: 360px; max-width: 500px; margin: 0 auto;">
<div class="pricing-popup-top" style="display: flex; justify-content: flex-end; padding-bottom: 0;">
<div class="pricing-popup-top-rgt">
<div class="plt-close-btn" title="Close modal">
<img src="https://cdn.prod.website-files.com/679b064a680c614548672a06/6aabe63ef90ae5b44195b877_cross-ico.svg" loading="lazy" alt="Close" class="plt-close-btn-ico">
</div>
</div>
</div>
<div class="pricing-popup-error-state" style="display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; margin: 0 auto; width: 100%; min-height: 240px; box-sizing: border-box;">
<div class="pricing-popup-error-title" style="text-align: center; width: 100%;">Failed to load trader details</div>
<div class="pricing-popup-error-desc" style="text-align: center; width: 100%;">${escapeHtml(message || "Unable to connect to leaderboard service.")}</div>
<button type="button" class="pricing-popup-retry-btn" style="margin: 6px auto 0;">Retry</button>
</div>
</div>
`;
  },

  render: function (data, tabIndex, fallbackItem, creator = false) {
    const apiConfig = PTL_CONFIG.apis[tabIndex] || {
      name: "Open 1",
    };

    const payload = data && typeof data === "object" ? data : {};
    const user = payload.user || payload.data || fallbackItem || {};
    const currentMatch = payload.current_match || {};
    const matchHistory = payload.match_history || [];

    const rawTraderName =
      user.username ||
      user.display_handle ||
      user.creator ||
      user.full_name ||
      user.trader_name ||
      user.name ||
      (fallbackItem &&
        (fallbackItem.display_handle ||
          fallbackItem.username ||
          fallbackItem.name)) ||
      "Trader";
    const traderName = rawTraderName ? String(rawTraderName).trim() : "Trader";
    const rankNum =
      user.rank !== undefined && user.rank !== null
        ? user.rank
        : fallbackItem &&
            fallbackItem.rank !== undefined &&
            fallbackItem.rank !== null
          ? fallbackItem.rank
          : 1;
    const leagueName = apiConfig.name || "Open 1";

    const countryName =
      user.country && user.country.name
        ? user.country.name
        : typeof user.country === "string"
          ? user.country
          : "";
    // Company belongs to the clicked leaderboard row, not the details response.
    const companySource = fallbackItem || {};
    const companyName = getCompanyName(companySource);
    const companyLogo = getProfileImageUrl(
      companySource.company?.image_url,
      companySource.company_image_url,
    );
    const isFinale =
      user.status === "finale" ||
      user.status === "in_finale_position" ||
      (user.status_label &&
        String(user.status_label).toLowerCase().includes("finale")) ||
      (creator
        ? user.reward?.finale_seat === true
        : typeof rankNum === "number" && rankNum <= 4);
    const creatorRank = Number(user.rank ?? fallbackItem?.rank);
    const showPopupTag =
      !creator ||
      (Number.isInteger(creatorRank) && creatorRank >= 1 && creatorRank < 9);
    const finaleTagText = creator
      ? `${creatorRank}${{ 1: "st", 2: "nd", 3: "rd" }[creatorRank] || "th"} place`
      : user.status_label ||
        (isFinale ? "In Finale position" : `${leagueName} Leaderboard`);

    // 5 Stat Cards
    const pointsVal =
      user.points !== undefined && user.points !== null
        ? user.points
        : fallbackItem && fallbackItem.points !== undefined
          ? fallbackItem.points
          : 0;
    const pointsNum =
      typeof pointsVal === "number"
        ? pointsVal
        : parseFloat(String(pointsVal).replace(/[^\d.-]/g, "")) || 0;
    const pointsPositive = pointsNum >= 0;
    const pointsDisplay =
      pointsVal == null
        ? "0 pts"
        : typeof pointsVal === "string" &&
            (pointsVal.includes("pts") || pointsVal.includes("pt"))
          ? pointsVal
          : `${pointsVal} pts`;
    const recordDisplay =
      user.record && user.record.display
        ? user.record.display
        : user.record_label ||
          (user.record &&
            `${user.record.wins || 0}W · ${user.record.draws || 0}D · ${user.record.losses || 0}L`) ||
          "-";

    const rawPnl =
      user.total_pnl !== undefined && user.total_pnl !== null
        ? user.total_pnl
        : fallbackItem && fallbackItem.total_pnl !== undefined
          ? fallbackItem.total_pnl
          : 0;
    const numericPnl =
      typeof rawPnl === "number"
        ? rawPnl
        : parseFloat(String(rawPnl).replace(/[$,+]/g, "")) || 0;
    const pnlPositive = numericPnl >= 0;
    const pnlFormatted = `${pnlPositive ? "+" : "-"}$${Math.abs(
      numericPnl,
    ).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

    const matchesPlayed =
      user.matches_played !== undefined && user.matches_played !== null
        ? user.matches_played
        : fallbackItem && fallbackItem.matches_played !== undefined
          ? fallbackItem.matches_played
          : 0;
    const totalMatches = user.total_matches || currentMatch.total_matches || 8;
    const remainingMatches = Math.max(0, totalMatches - matchesPlayed);

    // Live Match Data
    const curMatchNum =
      currentMatch.match_number ||
      (matchesPlayed + 1 > totalMatches ? totalMatches : matchesPlayed + 1) ||
      1;
    const curTotalMatches = currentMatch.total_matches || totalMatches || 8;

    const rawStatusLabel = currentMatch.status_label || "";
    const isLive = String(rawStatusLabel).trim().toLowerCase() === "live";
    const liveMatchHeaderHTML = isLive
      ? `
<div class="live-match-wrp grn_clr">
<div class="live-match-crcl"></div>
<div class="live-match-txt">LIVE NOW · MATCH ${curMatchNum}${creator ? "" : ` OF ${curTotalMatches}`}</div>
</div>
`
      : `
<div class="live-match-wrp">
<div class="live-match-txt">MATCH ${curMatchNum} OF ${curTotalMatches}</div>
</div>
`;

    function getFlag(code) {
      const raw = code && typeof code === "object" ? code.code : code;
      const normalized = typeof raw === "string" ? raw.trim().toLowerCase() : "";
      return /^[a-z]{2}$/.test(normalized)
        ? `https://flagcdn.com/${normalized}.svg`
        : PTL_CONFIG.fallbackImageUrl;
    }

    const matchUser = currentMatch.user || {};
    const matchOpponent = currentMatch.opponent || {};

    const youName = matchUser.username || traderName;
    const youFlag = getFlag(matchUser.country || user.country);
    const youCountryName =
      (matchUser.country && matchUser.country.name) ||
      countryName ||
      "United States";
    const youBalance =
      matchUser.balance !== undefined && matchUser.balance !== null
        ? Number(matchUser.balance)
        : 50000;
    const youBalancePositive = youBalance >= 0;
    const youBalanceText = `${youBalancePositive ? "+" : "-"}$${Math.abs(
      youBalance,
    ).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
    const youPnl =
      matchUser.pnl !== undefined && matchUser.pnl !== null
        ? Number(matchUser.pnl)
        : 0;
    const youPnlPositive = youPnl >= 0;
    const youPnlText = `${youPnlPositive ? "+" : "-"}$${Math.abs(
      youPnl,
    ).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

    let youTradeBlockHTML = "";
    if (matchUser.trades !== null && matchUser.trades !== undefined) {
      const youTradesText =
        matchUser.trades === 0
          ? "No trade"
          : matchUser.trades === 1
            ? "1 trade"
            : `${matchUser.trades} trades`;
      youTradeBlockHTML = `
<div class="ptl-live-trade-card-graph-dvd"></div>
<div class="ptl-live-trade-card-graph-trade">
<div class="ptl-live-trade-card-graph-trade-txt">${escapeHtml(youTradesText)}</div>
</div>
`;
    }

    const oppName = matchOpponent.username || "Opponent";
    const oppFlag = getFlag(matchOpponent.country);
    const oppCountryName =
      (matchOpponent.country && matchOpponent.country.name) ||
      "Opponent Country";
    const oppBalance =
      matchOpponent.balance !== undefined && matchOpponent.balance !== null
        ? Number(matchOpponent.balance)
        : 50000;
    const oppBalancePositive = oppBalance >= 0;
    const oppBalanceText = `${oppBalancePositive ? "+" : "-"}$${Math.abs(
      oppBalance,
    ).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
    const oppPnl =
      matchOpponent.pnl !== undefined && matchOpponent.pnl !== null
        ? Number(matchOpponent.pnl)
        : 0;
    const oppPnlPositive = oppPnl >= 0;
    const oppPnlText = `${oppPnlPositive ? "+" : "-"}$${Math.abs(
      oppPnl,
    ).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

    let oppTradeBlockHTML = "";
    if (matchOpponent.trades !== null && matchOpponent.trades !== undefined) {
      const oppTradesText =
        matchOpponent.trades === 0
          ? "No trade"
          : matchOpponent.trades === 1
            ? "1 trade"
            : `${matchOpponent.trades} trades`;
      oppTradeBlockHTML = `
<div class="ptl-live-trade-card-graph-dvd"></div>
<div class="ptl-live-trade-card-graph-trade">
<div class="ptl-live-trade-card-graph-trade-txt">${escapeHtml(oppTradesText)}</div>
</div>
`;
    }

    const totalBalance = youBalance + oppBalance;
    const rawPercent =
      totalBalance > 0 ? (youBalance / totalBalance) * 100 : 50;
    const progressPercent = Math.min(97, Math.max(3, rawPercent)).toFixed(2);
    const pnlDiff = youPnl - oppPnl;
    const isAhead = pnlDiff >= 0;
    const leadAmount = Math.abs(pnlDiff);
    const isZeroLead = Math.round(leadAmount) === 0;
    const leadText = isAhead
      ? `Player is ahead by $${Math.round(leadAmount).toLocaleString("en-US")} ▲`
      : `Player is behind by $${Math.round(leadAmount).toLocaleString("en-US")} ▼`;
    const leadClass = isAhead ? "is-lead green" : "is-behind red";

    let leadBtnHTML = "";
    if (!isZeroLead) {
      leadBtnHTML = `
<div class="ptl-live-trade-btn w-inline-block ${leadClass}">
<div class="ptl-live-trade-btn-txt">${escapeHtml(leadText)}</div>
</div>
`;
    }

    const flagImgUrl = creator
      ? getProfileImageUrl(user.image_url, user.company?.image_url)
      : getFlag(user.country);
    const flagHtml = `<img src="${escapeHtml(flagImgUrl)}" data-ptl-image-fallback loading="lazy" sizes="100vw" alt="${escapeHtml(countryName)}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;">`;

    const matchRowsHTML = this.generateMatchRows(matchHistory, apiConfig.id);

    return `
<div class="pricing-popup-wrp">
<div class="pricing-popup-top">
<div class="pricing-popup-top-left">
<div class="pricing-popup-top-left-wrp">
<div class="pricing-popup-top-pro">
${flagHtml}
</div>
<div class="pricing-popup-top-left-cont">
<div class="pricing-popup-top-left-head">
  <div class="pricing-popup-top-left-cont-txt">${escapeHtml(traderName)}</div>
  ${
    showPopupTag
      ? `<div class="creators-table-tag popup-tag${apiConfig.id === "open1" && isEliminated(user) ? " eleminated" : ""}">
    <img loading="lazy" src="https://cdn.prod.website-files.com/679b064a680c614548672a06/6aabc95eb50f16dab6ba9304_yell-star.svg" alt="" class="creators-table-tag-ico">
    <div class="creators-table-tag-txt">${escapeHtml(finaleTagText)}</div>
  </div>`
      : ""
  }
</div>
<div class="pricing-popup-top-left-head-txt${companyName === "-" ? " no-team" : ""}">
<span class="pricing-popup-team-label">Team:</span>
${companyName !== "-" ? `
<span class="pricing-popup-company">
<img src="${escapeHtml(companyLogo)}" alt="" width="24" height="24" class="pricing-popup-company-logo" data-ptl-image-fallback>
<span>${escapeHtml(companyName)}</span>
</span>
` : "No team"}
</div>
</div>
</div>
</div>
<div class="pricing-popup-top-rgt">
<div class="plt-close-btn" title="Close modal">
<img src="https://cdn.prod.website-files.com/679b064a680c614548672a06/6aabe63ef90ae5b44195b877_cross-ico.svg" loading="lazy" alt="Close" class="plt-close-btn-ico">
</div>
</div>
</div>

<div class="pricing-popup-rank">
<div class="pricing-popup-rank-row">
<div class="pricing-popup-rank-col">
<div class="pricing-popup-rank-card">
<div class="pricing-popup-rank-num yellow">#${escapeHtml(rankNum)}</div>
<div class="pricing-popup-rank-desc">${escapeHtml(leagueName)} rank</div>
</div>
</div>
<div class="pricing-popup-rank-col"><div class="pricing-popup-stick"></div></div>
<div class="pricing-popup-rank-col">
<div class="pricing-popup-rank-card">
<div class="pricing-popup-rank-num ${!pointsPositive ? "pts-negative" : ""}" style="${!pointsPositive ? "color: #f9cfcf;" : ""}">${escapeHtml(pointsDisplay)}</div>
<div class="pricing-popup-rank-desc">Total points</div>
</div>
</div>
<div class="pricing-popup-rank-col"><div class="pricing-popup-stick"></div></div>
<div class="pricing-popup-rank-col">
<div class="pricing-popup-rank-card">
<div class="pricing-popup-rank-num">${escapeHtml(recordDisplay)}</div>
<div class="pricing-popup-rank-desc">Track record</div>
</div>
</div>
<div class="pricing-popup-rank-col"><div class="pricing-popup-stick"></div></div>
<div class="pricing-popup-rank-col">
<div class="pricing-popup-rank-card">
<div class="pricing-popup-rank-num ${pnlPositive ? "green" : "#ef4444"}" style="color: ${pnlPositive ? "#03dc5d" : "#ef4444"};">${escapeHtml(pnlFormatted)}</div>
<div class="pricing-popup-rank-desc">Total P&amp;L</div>
</div>
</div>
<div class="pricing-popup-rank-col"><div class="pricing-popup-stick"></div></div>
<div class="pricing-popup-rank-col">
<div class="pricing-popup-rank-card">
<div class="pricing-popup-rank-num">${escapeHtml(matchesPlayed)}${creator ? "" : ` of ${escapeHtml(totalMatches)}`}</div>
<div class="pricing-popup-rank-desc">Matches played</div>
</div>
</div>
</div>
</div>

<div class="live-match-wrp-body">
${
  creator && !payload.current_match
    ? `<div class="live-match-wrp no-current-match"><div class="live-match-txt">No live match found.</div></div>`
    : `
${liveMatchHeaderHTML}
<div class="ptl-live-trade-outr">
<div class="ptl-live-trade">
<img src="https://cdn.prod.website-files.com/679b064a680c614548672a06/6aabecd199ad59a0d3d56f12_ptl-live-bg.png" loading="lazy" sizes="100vw" alt="" class="ptl-live-trade-bg">
<div class="ptl-live-trade-wrp">
<div class="ptl-live-trade-row">
  <div class="ptl-live-trade-col">
    <div class="ptl-live-trade-card">
      <div class="ptl-live-trade-card-top">
        <div class="ptl-live-trade-card-cuntr-outr">
          <div class="ptl-live-trade-card-cuntr">
            <img src="${escapeHtml(youFlag)}" data-ptl-image-fallback loading="lazy" alt="${escapeHtml(youCountryName)}" class="ptl-live-trade-card-cuntr-flag" style="object-fit: cover;">
          </div>
        </div>
        <div class="ptl-live-trade-card-top-cont">
          <div class="ptl-live-trade-card-top-cont-txt">PLAYER</div>
          <div class="ptl-live-trade-card-top-cont-name">${escapeHtml(youName)}</div>
        </div>
      </div>
      <div class="ptl-live-trade-card-btm">
        <div class="ptl-live-trade-card-btm-count ${youBalancePositive ? "" : "negative"}">${escapeHtml(youBalanceText)}</div>
        <div class="ptl-live-trade-card-graph">
          <div class="ptl-live-trade-card-graph-left" style="color: ${youPnlPositive ? "#03dc5d" : "#ef4444"};">
            <img src="https://cdn.prod.website-files.com/679b064a680c614548672a06/6aabf283c9bbb30927f8ca81_grn-arr.png" loading="lazy" alt="" class="ptl-live-trade-card-graph-arr ${youPnlPositive ? "" : "is-down red"}" style="${youPnlPositive ? "" : "transform: rotate(180deg); filter: hue-rotate(-140deg) saturate(100%);"}">
            <div class="ptl-live-trade-card-graph-txt" style="color: ${youPnlPositive ? "#03dc5d" : "#ef4444"};">${escapeHtml(youPnlText)}</div>
          </div>
          ${youTradeBlockHTML}
        </div>
      </div>
    </div>
  </div>
  <div class="ptl-live-trade-col mid">
    <img src="https://cdn.prod.website-files.com/679b064a680c614548672a06/6aabeec11976a225d8b717ca_vs-ico.png" loading="lazy" alt="" class="ptl-live-trade-mid-ico">
  </div>
  <div class="ptl-live-trade-col">
    <div class="ptl-live-trade-card right">
      <div class="ptl-live-trade-card-top right">
        <div class="ptl-live-trade-card-top-cont">
          <div class="ptl-live-trade-card-top-cont-txt">OPPONENT</div>
          <div class="ptl-live-trade-card-top-cont-name">${escapeHtml(oppName)}</div>
        </div>
        <div class="ptl-live-trade-card-cuntr-outr right">
          <div class="ptl-live-trade-card-cuntr">
            <img src="${escapeHtml(oppFlag)}" data-ptl-image-fallback loading="lazy" alt="${escapeHtml(oppCountryName)}" class="ptl-live-trade-card-cuntr-flag" style="object-fit: cover;">
          </div>
        </div>
      </div>
      <div class="ptl-live-trade-card-btm">
        <div class="ptl-live-trade-card-btm-count ${oppBalancePositive ? "" : "negative"}">${escapeHtml(oppBalanceText)}</div>
        <div class="ptl-live-trade-card-graph right">
          <div class="ptl-live-trade-card-graph-left" style="color: ${oppPnlPositive ? "#03dc5d" : "#ef4444"};">
            <img src="https://cdn.prod.website-files.com/679b064a680c614548672a06/6aabf283c9bbb30927f8ca81_grn-arr.png" loading="lazy" alt="" class="ptl-live-trade-card-graph-arr ${oppPnlPositive ? "" : "is-down red"}" style="${oppPnlPositive ? "" : "transform: rotate(180deg); filter: invert(38%) sepia(86%) saturate(2883%) hue-rotate(338deg) brightness(99%) contrast(92%);"}">
            <div class="ptl-live-trade-card-graph-txt" style="color: ${oppPnlPositive ? "#03dc5d" : "#ef4444"};">${escapeHtml(oppPnlText)}</div>
          </div>
          ${oppTradeBlockHTML}
        </div>
      </div>
    </div>
  </div>
</div>
<div class="ptl-live-trade-prgs"><div class="ptl-live-trade-prgs-inn"><div class="ptl-live-trade-prgs-wrp" style="width: ${progressPercent}%;"><div class="ptl-live-trade-prgs-skick"></div></div></div></div>
<div class="ptl-live-trade-btn-wrp">
  ${leadBtnHTML}
  <div class="ptl-live-trade-btm-txt" style="display: none;">Updated 2 hours 30 mins ago • Updates in 2 hours 12 mins</div>
</div>
</div>
</div>
</div>

`
}
<div class="track-record-main">
<div class="live-match-table-head">
<div class="live-match-table-head-left">TRACK RECORD · MATCH HISTORY</div>
${creator ? "" : `<div class="live-match-table-head-left rgt">${escapeHtml(leagueName)} · ${matchesPlayed} played, ${remainingMatches} remaining</div>`}
</div>
<div class="creators-table-main">
<div class="creators-table">
<div class="creators-table-head track-trable">
  <div class="creators-table-row">
    <div class="creators-table-col match"><div class="creators-table-box head track-table"><div class="creators-table-box-txt">Match</div></div></div>
    <div class="creators-table-col opponent"><div class="creators-table-box head track-table"><div class="creators-table-box-txt">Opponent</div></div></div>
    <div class="creators-table-col result"><div class="creators-table-box head track-table"><div class="creators-table-box-txt">Result</div></div></div>
    <div class="creators-table-col finals"><div class="creators-table-box head track-table rgt"><div class="creators-table-box-txt">Final balance</div></div></div>
    <div class="creators-table-col final-points"><div class="creators-table-box head track-table rgt"><div class="creators-table-box-txt">Points</div></div></div>
  </div>
</div>
<div class="creators-table-body track-tbl-bd">
  ${matchRowsHTML || '<div class="empty-state-text creator-empty-state-msg">No match history available.</div>'}
</div>
</div>
</div>
</div>
</div>
</div>
`;
  },

  open: async function (item, tabIndex, customUserId) {
    if (!item && !customUserId) return;
    if (!isModalEnabledForTab(tabIndex)) return;
    if (this === TraderDetailModal) CreatorDetailModal.close();

    let popup = document.querySelector(this.popupSelector);
    if (!popup) {
      popup = document.createElement("div");
      popup.className = this.popupClass;
      popup.setAttribute("role", "dialog");
      popup.setAttribute("aria-modal", "true");
      popup.setAttribute("aria-label", this.dialogLabel || "Trader details");
      document.body.appendChild(popup);
    }

    const requestId = (this.requestId = (this.requestId || 0) + 1);
    popup.innerHTML = this.renderLoading();
    popup.classList.remove("is-hidden");
    popup.classList.add("is-open");
    document.body.classList.add("ptl-modal-open");
    this.bindEvents(popup, item, tabIndex, customUserId);

    const apiConfig = PTL_CONFIG.apis[tabIndex] || {};
    const userId =
      customUserId ||
      (item &&
        (item.user_id !== undefined && item.user_id !== null
          ? item.user_id
          : item.userId !== undefined && item.userId !== null
            ? item.userId
            : item.id));

    const baseUrl = (apiConfig.ap_url || apiConfig.api_url || "").trim();
    if (this === CreatorDetailModal && isApiEnabled(apiConfig) && !userId) {
      popup.innerHTML = this.renderError(
        "This creator has no user ID available.",
      );
      this.bindEvents(popup, item, tabIndex, userId);
      return;
    }
    if (isApiEnabled(apiConfig) && baseUrl && userId) {
      try {
        const cleanBase = baseUrl.replace(/\/+$/, "");
        const detailsUrl = `${cleanBase}/details/?user_id=${encodeURIComponent(userId)}`;
        console.log(
          "[PTL Leaderboard] Fetching trader details endpoint:",
          detailsUrl,
        );

        const response = await fetch(detailsUrl, {
          headers: {
            Accept: "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(
            `HTTP ${response.status}: Failed to load trader details`,
          );
        }

        const json = await response.json();
        if (json && json.success === false) {
          throw new Error(
            json.message || json.error || "Failed to load trader details",
          );
        }

        if (requestId !== this.requestId) return;
        popup.innerHTML = this.render(json, tabIndex, item);
        this.bindEvents(popup, item, tabIndex, userId);
      } catch (err) {
        if (requestId !== this.requestId) return;
        console.error("[PTL Modal] Error fetching trader details:", err);
        popup.innerHTML = this.renderError(
          err.message || "Unable to connect to leaderboard service.",
        );
        this.bindEvents(popup, item, tabIndex, userId);
      }
    } else {
      let demoData =
        apiConfig.demo_individual_data ||
        (typeof PTL_DEMO_DATA !== "undefined"
          ? PTL_DEMO_DATA.creator_league_2_individual_data
          : null);
      if (this === CreatorDetailModal) demoData = { user: item };
      popup.innerHTML = this.render(demoData, tabIndex, item);
      this.bindEvents(popup, item, tabIndex, userId);
    }
  },

  bindEvents: function (popup, item, tabIndex, userId) {
    if (!popup) return;
    const closeBtns = popup.querySelectorAll(".plt-close-btn");
    closeBtns.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        this.close();
      });
    });

    const retryBtn = popup.querySelector(".pricing-popup-retry-btn");
    if (retryBtn) {
      retryBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        this.open(item, tabIndex, userId);
      });
    }

    popup.onclick = (e) => {
      if (e.target === popup) {
        this.close();
      }
    };
  },

  close: function () {
    this.requestId = (this.requestId || 0) + 1;
    const popup = document.querySelector(this.popupSelector);
    if (popup) {
      popup.classList.remove("is-open");
      popup.classList.add("is-hidden");
      document.body.classList.remove("ptl-modal-open");
    }
  },

  init: function () {
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        const popup = document.querySelector(this.popupSelector);
        if (popup && popup.classList.contains("is-open")) {
          this.close();
        }
      }
    });
  },
};


const CreatorDetailModal = {
  ...TraderDetailModal,
  popupSelector: ".creator-popup-main",
  popupClass: "pricing-popup-main creator-popup-main",
  dialogLabel: "Creator details",
  open: function (item, tabIndex = 2, userId) {
    TraderDetailModal.close();
    return TraderDetailModal.open.call(this, item, 2, userId);
  },
  renderLoading: function () {
    return TraderDetailModal.renderLoading().replace(
      "Loading trader details",
      "Loading creator details",
    );
  },
  renderError: function (message) {
    return TraderDetailModal.renderError(message).replace(
      "Failed to load trader details",
      "Failed to load creator details",
    );
  },
  render: function (response, tabIndex, fallbackItem) {
    const payload = response?.data || response || {};
    const user = { ...fallbackItem, ...payload.user };
    user.username = user.display_handle || user.username || user.full_name;
    user.total_matches = user.total_game_days ?? payload.total_game_days;
    const normalized = {
      ...payload,
      user,
      match_history: (payload.match_history || []).map((match) => ({
        ...match,
        match: match.game_day != null ? `Day ${match.game_day}` : match.match,
      })),
    };
    return TraderDetailModal.render.call(
      this,
      normalized,
      2,
      fallbackItem,
      true,
    );
  },
};

function getDetailModal(tabIndex) {
  return Number(tabIndex) === 2 ? CreatorDetailModal : TraderDetailModal;
}

/* PIECE 1 */
function getApiBaseUrl() {
  try {
    const currentUrl =
      typeof window !== "undefined" && window.location && window.location.href
        ? window.location.href.toLowerCase()
        : "";
    if (!currentUrl) {
      return "https://api-f.tradeify.co";
    }
    if (currentUrl.includes("webflow.io")) {
      return "https://api-f.tradeify.co";
    }
    return "https://api-f.tradeify.co";
  } catch (e) {
    return "https://api-f.tradeify.co";
  }
}

const API_BASE_URL = getApiBaseUrl();
const PTL_CONFIG = {
  sectionId: "ptl-leaderboard",
  defaultTabIndex: 0,
  pageSize: 10,
  // Used when a country flag, user image, or company image is unavailable.
  fallbackImageUrl:
    "https://cdn.prod.website-files.com/6a981ac8d7b7736a6a02b0a1/6a9939ae5de5151dfcda15f5_6a84628529744886a578d5b9_icon.png",
  starIconUrl:
    "https://cdn.prod.website-files.com/679b064a680c614548672a06/6aabc95eb50f16dab6ba9304_yell-star.svg",
  enableTraderModal: true,

  // Global toggle switch: true = load live API data, false = load static demo data
  use_api: true,

  apis: {
    0: {
      id: "open1",
      name: "Open 1",
      finaleSeatText: "Finale Seat",
      rewardsByRank: [
        ...Array(4).fill("Up to $180,000"), // 1–4
        "$10,000", // 5
        ...Array(5).fill("$8,000"), // 6–10
        ...Array(15).fill("$4,000"), // 11–25
        ...Array(25).fill("$2,000"), // 26–50
        ...Array(100).fill("$525"), // 51–150
        ...Array(350).fill("$250"), // 151–500
      ],
      enableNameClick: true, // false = plain text name with no click action
      enableTraderModal: true,
      show_highlight: true, // true = highlight qualifying ranks; false = no row highlights
      highlightRowCount: 4, // Highest qualifying rank for highlighting and the Finale Seat label
      ap_url: `${API_BASE_URL}/app/v1/journal/ptl/open1/leaderboard/public/`,
      demo_data:
        typeof PTL_DEMO_DATA !== "undefined" ? PTL_DEMO_DATA.open1 : null,
      demo_individual_data:
        typeof PTL_DEMO_DATA !== "undefined"
          ? PTL_DEMO_DATA.creator_league_2_individual_data
          : null,
      use_api: true, // Toggle switch: true = API, false = static demo data
      is_live: true, // Backward-compatible alias
      usePagination: true,
      pageSize: 10,
      showSearch: true,
      filters: {
        rank: {
          label: "Rank",
          options: [
            { value: "all", label: "All" },
            {
              value: "upto500",
              label: "Up to 500",
              start_rank: 1,
              end_rank: 500,
            },
            {
              value: "above500",
              label: "Above 500",
              start_rank: 501,
            },
          ],
        },
        status: {
          label: "Status",
          apiParam: "status",
          options: [
            { value: "all", label: "All Players" },
            { value: "active", label: "Active Players only" },
            {
              value: "eliminated",
              label: "Eliminated Players only",
            },
          ],
          aliases: { advancing: "active" },
        },
        company: {
          label: "Company",
          apiParam: "company_id", // Send the selected team ID, not its display name.
          // Demo team IDs: replace values with actual API team IDs; labels are display names.
          options: [
            { value: "all", label: "All" },
            { value: "42", label: "EsfandTV's Trading Co" },
            { value: "102", label: "Tminnzy's Trading Co" },
            { value: "103", label: "Arteezy's Trading Co" },
            { value: "104", label: "Frodan's Trading Co" },
          ],
        },
      },

      data: null,
      pagination: null,
      loaded: false,
      coming_soon: false, // Toggle switch: true = show Coming Soon box, false = show normal table
      coming_soon_title: "Coming Soon",
      coming_soon_desc: "The game will begins on 21th September",
    },
    1: {
      id: "open2",
      name: "Open 2",
      finaleSeatText: "Finale Seat",
      rewardsByRank: [
        ...Array(4).fill("Up to $180,000"), // 1–4
        "$10,000", // 5
        ...Array(5).fill("$8,000"), // 6–10
        ...Array(15).fill("$4,000"), // 11–25
        ...Array(25).fill("$2,000"), // 26–50
        ...Array(100).fill("$525"), // 51–150
        ...Array(350).fill("$250"), // 151–500
      ],
      enableNameClick: true,
      enableTraderModal: true,
      highlightRowCount: 4,
      show_highlight: true,
      ap_url: `https://api-u.tradeify.co/app/v1/journal/ptl/open2/leaderboard/public/`,
      // ap_url: `${API_BASE_URL}/app/v1/journal/ptl/open1/leaderboard/public/`,
      demo_data:
        typeof PTL_DEMO_DATA !== "undefined" ? PTL_DEMO_DATA.open2 : null,
      demo_individual_data:
        typeof PTL_DEMO_DATA !== "undefined"
          ? PTL_DEMO_DATA.creator_league_2_individual_data
          : null,
      coming_soon: true, // Toggle switch: true = show Coming Soon box, false = show normal table
      coming_soon_title: "Coming Soon",
      coming_soon_desc: "The game will begins on 26th October",
      use_api: true, // Toggle switch: true = API, false = static demo data
      is_live: true,
      usePagination: true,
      pageSize: 10,
      showSearch: true,
      filters: {
        rank: {
          label: "Rank",
          options: [
            { value: "all", label: "All" },
            {
              value: "upto500",
              label: "Up to 500",
              start_rank: 1,
              end_rank: 500,
            },
            {
              value: "above500",
              label: "Above 500",
              start_rank: 501,
            },
          ],
        },
        status: {
          label: "Status",
          apiParam: "status",
          options: [
            { value: "all", label: "All Players" },
            { value: "active", label: "Active Players only" },
            { value: "eliminated", label: "Eliminated Players only" },
            { value: "forfeited", label: "Forfeited Players only" },
          ],
          aliases: { advancing: "active" },
        },
        company: {
          label: "Company",
          apiParam: "team_id", // Send the selected team ID, not its display name.
          // Demo team IDs: replace values with actual API team IDs; labels are display names.
          options: [
            { value: "all", label: "All" },
            { value: "101", label: "Demo Trading Co" },
            { value: "102", label: "Demo Capital" },
            { value: "103", label: "Demo Markets" },
          ],
        },
      },

      data: null,
      pagination: null,
      loaded: false,
    },
    2: {
      id: "creator_league_2",
      name: "Creator League",
      finaleSeatText: "Finale Seat",
      rewardsByRank: [
        "$50,000",
        "$35,000",
        "$25,000",
        "$20,000",
        "$18,000",
        "$18,000",
        "$14,000",
        "$14,000",
        "$8,000",
        "$8,000",
        "$8,000",
        "$8,000",
        "$6,000",
        "$6,000",
        "$6,000",
        "$6,000",
      ],
      enableNameClick: true,
      enableTraderModal: true,
      highlightRowCount: 8,
      show_highlight: true,
      ap_url: `${API_BASE_URL}/app/v1/journal/ptl/creator/leaderboard/public/`,
      demo_data:
        typeof PTL_DEMO_DATA !== "undefined"
          ? PTL_DEMO_DATA.creator_league_2
          : null,
      demo_individual_data:
        typeof PTL_DEMO_DATA !== "undefined"
          ? PTL_DEMO_DATA.creator_league_2_individual_data
          : null,
      use_api: true, // Toggle switch: true = API, false = static demo data
      is_live: true,
      usePagination: false,
      showSearch: false,
      filters: null, // Creator has no filters
      data: null,
      pagination: null,
      loaded: false,
      coming_soon: false, // Toggle switch: true = show Coming Soon box, false = show normal table
      coming_soon_title: "Coming Soon",
      coming_soon_desc: "The game will begins on 28th September",
    },
  },
};

function getCompanyName(item) {
  const sources = [
    typeof item.company === "string" ? item.company : item.company?.name,
    item.company_name,
  ];
  return sources.find((name) =>
    typeof name === "string" && name.trim() &&
    !["-", "not_found", "null", "undefined"].includes(name.trim().toLowerCase())
  )?.trim() || "-";
}

function getProfileImageUrl(...sources) {
  return sources.find((source) =>
    typeof source === "string" && source.trim() &&
    !["not_found", "null", "undefined"].includes(source.trim().toLowerCase())
  )?.trim() || PTL_CONFIG.fallbackImageUrl;
}

function initImageFallbacks() {
  document.addEventListener("error", (event) => {
    const image = event.target;
    if (!(image instanceof HTMLImageElement) ||
        !image.hasAttribute("data-ptl-image-fallback")) return;
    // Remove the marker first so a failed fallback cannot trigger a retry loop.
    image.removeAttribute("data-ptl-image-fallback");
    if (image.getAttribute("src") !== PTL_CONFIG.fallbackImageUrl) {
      image.src = PTL_CONFIG.fallbackImageUrl;
    }
  }, true);
}

function isApiEnabled(apiConfig) {
  if (!apiConfig) return Boolean(PTL_CONFIG.use_api !== false);
  if (apiConfig.use_api !== undefined) return Boolean(apiConfig.use_api);
  if (apiConfig.is_live !== undefined) return Boolean(apiConfig.is_live);
  if (PTL_CONFIG.use_api !== undefined) return Boolean(PTL_CONFIG.use_api);
  return true;
}

function isComingSoon(apiConfig) {
  if (!apiConfig) return false;
  return Boolean(apiConfig.coming_soon || apiConfig.is_coming_soon);
}

const state = {
  activeTabIndex:
    PTL_CONFIG.defaultTabIndex !== undefined ? PTL_CONFIG.defaultTabIndex : 0,
  searchByTab: { 0: "", 1: "" },
  get searchQuery() {
    return this.searchByTab[this.activeTabIndex] || "";
  },
  set searchQuery(value) {
    if (PTL_CONFIG.apis[this.activeTabIndex]?.showSearch) {
      this.searchByTab[this.activeTabIndex] = value;
    }
  },
  filtersByTab: {
    0: { rank: "all", status: "all", company: "all" },
    1: { rank: "all", status: "all", company: "all" },
  },
  currentPageByTab: {
    0: 1,
    1: 1,
    2: 1,
  },
};

const medals = {
  1: "https://cdn.prod.website-files.com/6a981ac8d7b7736a6a02b0a1/6aabece5aa1c4719edc25f46_1.png",
  2: "https://cdn.prod.website-files.com/6a981ac8d7b7736a6a02b0a1/6aabece43f2100adecbfb34b_2.png",
  3: "https://cdn.prod.website-files.com/6a981ac8d7b7736a6a02b0a1/6aabece56901d4d58ca5fb93_3.png",
};

function escapeHtml(str) {
  if (str === null || str === undefined) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function sanitizeInput(str) {
  if (str === null || str === undefined) return "";
  let val = String(str);
  // Remove entire script and style blocks including contents
  val = val.replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gi, "");
  val = val.replace(/<style\b[^>]*>([\s\S]*?)<\/style>/gi, "");
  // Remove all HTML tags e.g. <script>, <img ...>, <iframe ...>, etc.
  val = val.replace(/<[^>]*>?/gm, "");
  // Remove stray angle brackets and dangerous characters that could break out of attributes or HTML contexts
  val = val.replace(/[<>]/g, "");
  // Remove dangerous pseudo-protocols like javascript:, vbscript:, data:
  val = val.replace(/(javascript|vbscript|data):/gi, "");
  // Remove dangerous inline event handlers like onerror=, onclick=, onload=, etc.
  val = val.replace(/on\w+\s*=/gi, "");
  return val;
}

function formatRank(rank, item) {
  if (rank === undefined || rank === null || rank === "") return "-";
  const num = parseInt(rank, 10);
  const isPointsNull =
    !item || item.points === null || item.points === undefined;
  const isMatchesNull =
    !item || item.matches_played === null || item.matches_played === undefined;
  const hideBadges = isPointsNull && isMatchesNull;

  let arrowHTML = "";
  const curRank = !isNaN(num)
    ? num
    : item && item.rank !== undefined && item.rank !== null && item.rank !== ""
      ? parseInt(item.rank, 10)
      : NaN;
  const hasPrevRank =
    item &&
    item.previous_rank !== null &&
    item.previous_rank !== undefined &&
    item.previous_rank !== "";
  const prevRank = hasPrevRank ? parseInt(item.previous_rank, 10) : null;

  if (hasPrevRank && !isNaN(curRank) && !isNaN(prevRank)) {
    // A smaller rank number means the player moved up the leaderboard.
    const rankChange = prevRank - curRank;
    if (rankChange > 0) {
      const tooltip = `Rank increased by +${rankChange}`;
      arrowHTML = ` <span class="ptl-rank-arr up" tabindex="0" aria-label="${tooltip}" data-ptl-tooltip="${tooltip}"><svg width="9" height="9" viewBox="0 0 10 10" fill="currentColor" aria-hidden="true"><path d="M5 1.5L9 7.5H1L5 1.5Z"/></svg></span>`;
    } else if (rankChange < 0) {
      const tooltip = `Rank decreased by ${rankChange}`;
      arrowHTML = ` <span class="ptl-rank-arr down" tabindex="0" aria-label="${tooltip}" data-ptl-tooltip="${tooltip}"><svg width="9" height="9" viewBox="0 0 10 10" fill="currentColor" aria-hidden="true"><path d="M5 8.5L1 2.5H9L5 8.5Z"/></svg></span>`;
    } else {
      arrowHTML = ` <span class="ptl-rank-arr is-hidden" style="display: none;" aria-hidden="true"><svg width="9" height="9" viewBox="0 0 10 10" fill="currentColor"><path d="M5 1.5L9 7.5H1L5 1.5Z"/></svg></span>`;
    }
  } else {
    arrowHTML = ` <span class="ptl-rank-arr is-hidden" style="display: none;" aria-hidden="true"><svg width="9" height="9" viewBox="0 0 10 10" fill="currentColor"><path d="M5 1.5L9 7.5H1L5 1.5Z"/></svg></span>`;
  }

  if (!hideBadges && medals[num]) {
    return `<img src="${medals[num]}" alt="" class="creators-table-medal" width="24" height="24"> ${num}${arrowHTML}`;
  }
  return (isNaN(num) ? String(rank) : String(num)) + arrowHTML;
}

function formatPoints(points) {
  if (points === undefined || points === null || points === "") return "-";
  if (typeof points === "number") {
    return points.toLocaleString("en-US") + " pts";
  }
  const str = String(points).trim();
  if (!str) return "-";
  if (str.toLowerCase().includes("pts") || str.startsWith("$")) return str;
  const parsed = parseFloat(str.replace(/[^0-9.-]+/g, ""));
  return !isNaN(parsed) ? parsed.toLocaleString("en-US") + " pts" : str;
}

function formatMatches(item) {
  if (!item) return "-";
  if (
    item.record_label &&
    typeof item.record_label === "string" &&
    item.record_label.trim() !== ""
  ) {
    return item.record_label.trim();
  }
  if (item.match_record && typeof item.match_record === "object") {
    const won = item.match_record.won;
    const drawn =
      item.match_record.drawn !== undefined
        ? item.match_record.drawn
        : item.match_record.draw;
    const lost = item.match_record.lost;
    if (
      (won === null || won === undefined) &&
      (drawn === null || drawn === undefined) &&
      (lost === null || lost === undefined)
    ) {
      return "-";
    }
    const w = won !== undefined && won !== null ? won : 0;
    const d = drawn !== undefined && drawn !== null ? drawn : 0;
    const l = lost !== undefined && lost !== null ? lost : 0;
    return `${w}W · ${d}D · ${l}L`;
  }
  if (item.matches) {
    if (typeof item.matches === "string" && item.matches.trim() !== "")
      return item.matches.trim();
    if (typeof item.matches === "object") {
      const w = item.matches.wins || 0;
      const d = item.matches.draws || 0;
      const l = item.matches.losses || 0;
      return `${w}W · ${d}D · ${l}L`;
    }
  }
  if (
    item.record &&
    typeof item.record === "string" &&
    item.record.trim() !== ""
  )
    return item.record.trim();
  if (
    item.wins !== undefined ||
    item.losses !== undefined ||
    item.draws !== undefined
  ) {
    const w = item.wins !== undefined && item.wins !== null ? item.wins : 0;
    const d = item.draws !== undefined && item.draws !== null ? item.draws : 0;
    const l =
      item.losses !== undefined && item.losses !== null ? item.losses : 0;
    if (item.wins === null && item.draws === null && item.losses === null)
      return "-";
    return `${w}W · ${d}D · ${l}L`;
  }
  return "-";
}

function formatPnL(pnl) {
  if (pnl === undefined || pnl === null || pnl === "") {
    return {
      text: "-",
      isPositive: false,
    };
  }
  if (typeof pnl === "number") {
    const isPositive = pnl >= 0;
    const formatted = Math.abs(pnl).toLocaleString("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });
    return {
      text: (isPositive ? "+$" : "-$") + formatted,
      isPositive: isPositive,
    };
  }
  const str = String(pnl).trim();
  if (!str) {
    return {
      text: "-",
      isPositive: false,
    };
  }
  return {
    text: str,
    isPositive: !str.startsWith("-"),
  };
}

function isEliminated(item) {
  return (
    String(item?.status || "")
      .trim()
      .toLowerCase() === "eliminated"
  );
}

function renderReward(
  item,
  rank,
  isCreatorTable = false,
  isRunnerUp = false,
  finaleSeatText = "",
  rewardsByRank = isCreatorTable ? PTL_CONFIG.apis[2].rewardsByRank : null,
) {
  if (!item) return `<div class="creators-table-box-count bg-font">-</div>`;
  if (isEliminated(item)) {
    return `<div class="creators-table-box-count bg-font">Eliminated</div>`;
  }
  const r = parseInt(rank, 10);
  if (rewardsByRank) {
    const rewardRank = Number(rank);
    const rewardText = Number.isInteger(rewardRank)
      ? rewardsByRank[rewardRank - 1]
      : null;
    if (!rewardText) {
      return `<div class="creators-table-box-count bg-font">-</div>`;
    }
    if (isCreatorTable ? rewardRank <= 8 : isRunnerUp) {
      return `
<div class="creators-table-tag reward-tag finale-seat-tag">
<img loading="lazy" src="${PTL_CONFIG.starIconUrl}" alt="" class="creators-table-tag-ico">
<div class="creators-table-tag-txt finale-prize-label">${escapeHtml(rewardText)}</div>
<span class="creators-table-tag-txt finale-seat-label">${escapeHtml(finaleSeatText)}</span>
</div>
`;
    }
    return `<div class="creators-table-box-count bg-font">${escapeHtml(rewardText)}</div>`;
  }
  const rewardObj =
    item && typeof item.reward === "object" && item.reward !== null
      ? item.reward
      : null;
  const isPointsNull =
    item && (item.points === null || item.points === undefined);
  const isMatchesNull =
    item && (item.matches_played === null || item.matches_played === undefined);
  const hideBadges = isPointsNull && isMatchesNull;

  const isFinaleSeat =
    !hideBadges &&
    (item.finale_seat ||
      (rewardObj &&
        (rewardObj.finale_seat || rewardObj.type === "finale_seat")) ||
      item.reward === "Finale seat" ||
      (!isCreatorTable && r <= 4));

  if (isFinaleSeat || isRunnerUp) {
    const rewardText =
      (rewardObj && rewardObj.label) ||
      (typeof item.reward === "string" && item.reward) ||
      item.prize ||
      (isFinaleSeat ? finaleSeatText : "");
    return `
<div class="creators-table-tag reward-tag${isRunnerUp ? " finale-seat-tag" : ""}">
<img loading="lazy" src="${PTL_CONFIG.starIconUrl}" alt="" class="creators-table-tag-ico">
${rewardText ? `<div class="creators-table-tag-txt finale-prize-label">${escapeHtml(rewardText)}</div>` : ""}
${isRunnerUp ? `<span class="creators-table-tag-txt finale-seat-label">${escapeHtml(finaleSeatText)}</span>` : ""}
</div>
`;
  }

  if (rewardObj && rewardObj.label) {
    return `<div class="creators-table-box-count bg-font">${escapeHtml(rewardObj.label)}</div>`;
  }

  if (item.reward || item.prize) {
    const prizeText =
      typeof item.reward === "string" ? item.reward : item.prize;
    return `<div class="creators-table-box-count bg-font">${escapeHtml(prizeText)}</div>`;
  }

  return `<div class="creators-table-box-count bg-font">-</div>`;
}

function isModalEnabledForTab(tabIndex) {
  if (!PTL_CONFIG.enableTraderModal) return false;
  const apiConfig = PTL_CONFIG.apis[tabIndex];
  return Boolean(apiConfig && apiConfig.enableTraderModal);
}

/* PIECE 2 */
function createRowHTML(item, globalIndex, tabIndex, pageIndex) {
  const isCreatorTable = tabIndex === 2;
  const eliminated = isEliminated(item);
  const rankNum =
    item.rank !== undefined && item.rank !== null && item.rank !== ""
      ? item.rank
      : isCreatorTable
        ? null
        : globalIndex + 1;
  const rankDisplay = formatRank(rankNum, item);
  const rawTraderName =
    item.creator ||
    item.display_handle ||
    item.username ||
    item.full_name ||
    item.trader_name ||
    item.name;
  const traderName = rawTraderName ? String(rawTraderName).trim() : "-";
  const companyName = getCompanyName(item);
  const companyLogo = getProfileImageUrl(
    item.company?.image_url,
    item.company_image_url,
  );
  const userId =
    item.user_id !== undefined && item.user_id !== null
      ? item.user_id
      : item.userId !== undefined && item.userId !== null
        ? item.userId
        : item.id !== undefined && item.id !== null
          ? item.id
          : "";
  const isClickable =
    PTL_CONFIG.apis[tabIndex].enableNameClick !== false &&
    isModalEnabledForTab(tabIndex);
  const actionType = isClickable ? "open-modal" : "";

  let supportersText = "";
  if (item.supporters_label) {
    supportersText = item.supporters_label;
  } else if (
    item.supporters !== undefined &&
    item.supporters !== null &&
    item.supporters !== ""
  ) {
    supportersText =
      Number(item.supporters).toLocaleString("en-US") + " supporters";
  }

  const rawPoints =
    item.points !== undefined && item.points !== null
      ? item.points
      : item.score;
  const pointsDisplay = formatPoints(rawPoints);
  const numericPoints =
    typeof rawPoints === "number"
      ? rawPoints
      : parseFloat(String(rawPoints ?? "").replace(/[^0-9.-]+/g, ""));
  const pointsClass =
    numericPoints > 0 ? "active" : numericPoints < 0 ? "red" : "";
  const matchesDisplay = formatMatches(item);

  const rawPnl =
    item.total_pnl !== undefined && item.total_pnl !== null
      ? item.total_pnl
      : item.live_pnl !== undefined && item.live_pnl !== null
        ? item.live_pnl
        : item.pnl !== undefined && item.pnl !== null
          ? item.pnl
          : item.net_pnl;

  let numericPnl = null;
  if (typeof rawPnl === "number") {
    numericPnl = rawPnl;
  } else if (
    typeof rawPnl === "string" &&
    rawPnl.trim() !== "" &&
    rawPnl !== "-"
  ) {
    const parsed = parseFloat(rawPnl.replace(/[$,+]/g, ""));
    if (!isNaN(parsed)) numericPnl = parsed;
  } else if (
    item.total_pnl_label &&
    item.total_pnl_label !== "-" &&
    item.total_pnl_label !== "0"
  ) {
    const parsed = parseFloat(
      String(item.total_pnl_label).replace(/[$,+]/g, ""),
    );
    if (!isNaN(parsed)) numericPnl = parsed;
  }

  const pnlObj = item.total_pnl_label
    ? {
        text: item.total_pnl_label,
        isPositive:
          numericPnl !== null
            ? numericPnl > 0
            : !String(item.total_pnl_label).startsWith("-"),
      }
    : formatPnL(rawPnl);

  // Color the displayed Total PnL, including API-provided formatted labels.
  const displayedPnl = parseFloat(String(pnlObj.text).replace(/[$,\s]/g, ""));
  if (Number.isFinite(displayedPnl)) numericPnl = displayedPnl;
  let pnlClass = "";
  if (numericPnl !== null) {
    if (numericPnl > 0) {
      pnlClass = "active";
    } else if (numericPnl < 0) {
      pnlClass = "red";
    }
  } else if (pnlObj.text && pnlObj.text !== "-" && pnlObj.text !== "0") {
    const displayedPnl = parseFloat(String(pnlObj.text).replace(/[$,\s]/g, ""));
    if (displayedPnl > 0) pnlClass = "active";
    else if (displayedPnl < 0) pnlClass = "red";
  }

  const highlightRowCount = PTL_CONFIG.apis[tabIndex].highlightRowCount;
  // Match the displayed/reward rank, including the fallback when API rank is missing.
  const highlightRank = Number(rankNum);
  const isRunnerUp =
    !eliminated &&
    Number.isInteger(highlightRank) &&
    highlightRank >= 1 &&
    highlightRank <= highlightRowCount;
  const rewardHTML = renderReward(
    item,
    rankNum,
    isCreatorTable,
    isRunnerUp,
    PTL_CONFIG.apis[tabIndex].finaleSeatText,
    PTL_CONFIG.apis[tabIndex].rewardsByRank,
  );

  const supportersHTML = supportersText
    ? `<div class="creators-table-box-count">${escapeHtml(supportersText)}</div>`
    : "";

  return `
<div class="creators-table-row ${eliminated ? "eliminated" : PTL_CONFIG.apis[tabIndex].show_highlight === true && isRunnerUp ? "runners-up" : ""}" data-trader="${escapeHtml(traderName.toLowerCase())}">
<div class="creators-table-col rank">
<div class="creators-table-box">
<div class="creators-table-box-rank clr">${rankDisplay}</div>
</div>
</div>
<div class="creators-table-col trader ${isClickable ? "clickable" : ""}${eliminated ? " eleminated_user" : ""}" ${actionType ? `data-action="${actionType}" data-row-idx="${pageIndex}" title="View details for ${escapeHtml(traderName)}"` : ""}>
<div class="creators-table-box">
${
  isClickable
    ? `<a href="#" class="creators-table-box-count bg-font" data-userid="${escapeHtml(userId)}">${escapeHtml(traderName)}</a>`
    : `<span class="creators-table-box-count bg-font">${escapeHtml(traderName)}</span>`
}
${supportersHTML}
</div>
</div>
${!isCreatorTable ? `
<div class="creators-table-col company">
<div class="creators-table-box">
<div class="ptl-company">
${companyName !== "-" ? `<img src="${escapeHtml(companyLogo)}" alt="" loading="lazy" width="28" height="28" class="ptl-company-logo" data-ptl-image-fallback>` : ""}
<span class="creators-table-box-count bg-font">${escapeHtml(companyName)}</span>
</div>
</div>
</div>
` : ""}
<div class="creators-table-col points">
<div class="creators-table-box head">
<div class="creators-table-box-count bg-font ${pointsClass}">${escapeHtml(pointsDisplay)}</div>
</div>
</div>
<div class="creators-table-col matches">
<div class="creators-table-box head">
<div class="creators-table-box-count bg-font">${escapeHtml(matchesDisplay)}</div>
</div>
</div>
<div class="creators-table-col total">
<div class="creators-table-box head">
<div class="creators-table-box-count bg-font ${pnlClass}">${escapeHtml(pnlObj.text)}</div>
</div>
</div>
<div class="creators-table-col reward">
<div class="creators-table-box head last">
${rewardHTML}
</div>
</div>
</div>
`;
}

function showLoading(container) {
  const tableBody = container.querySelector(".creators-table-body");
  if (!tableBody) return;
  tableBody.innerHTML = `
<div class="creators-table-row loading-state">
<div class="ptl-spinner"></div>
<div class="loading-text">Loading leaderboard...</div>
</div>
`;

  const existingPagination = container.querySelector(".ptl-pagination-wrp");
  if (existingPagination) existingPagination.remove();

  const leaderboardEl = document.getElementById(PTL_CONFIG.sectionId);
  if (leaderboardEl) {
    const searchWrp = leaderboardEl.querySelector(".input-search-wrp");
    if (searchWrp) searchWrp.classList.remove("is-visible");
  }
}

function showError(
  container,
  tabIndex,
  message = "Failed to load leaderboard data.",
) {
  const tableBody = container.querySelector(".creators-table-body");
  if (!tableBody) return;
  tableBody.innerHTML = `
<div class="creators-table-row error-state">
<div class="error-state-text">${escapeHtml(message)}</div>
<button type="button" class="retry-btn">Retry</button>
</div>
`;

  const existingPagination = container.querySelector(".ptl-pagination-wrp");
  if (existingPagination) existingPagination.remove();

  const leaderboardEl = document.getElementById(PTL_CONFIG.sectionId);
  if (leaderboardEl) {
    updateSearchVisibility(leaderboardEl, PTL_CONFIG.apis[tabIndex]);
  }

  const retryBtn = tableBody.querySelector(".retry-btn");
  if (retryBtn) {
    retryBtn.addEventListener("click", () => {
      loadTabData(tabIndex, true);
    });
  }
}

function extractResults(payload) {
  if (!payload) return [];
  if (Array.isArray(payload)) return payload;
  if (typeof payload === "object") {
    if (Array.isArray(payload.results)) return payload.results;
    if (Array.isArray(payload.data)) return payload.data;
    if (
      payload.data &&
      typeof payload.data === "object" &&
      Array.isArray(payload.data.leaderboard)
    ) {
      return payload.data.leaderboard;
    }
    if (
      payload.data &&
      typeof payload.data === "object" &&
      Array.isArray(payload.data.results)
    ) {
      return payload.data.results;
    }
    if (Array.isArray(payload.leaderboard)) return payload.leaderboard;
    if (Array.isArray(payload.participants)) return payload.participants;
    if (Array.isArray(payload.rows)) return payload.rows;
    if (Array.isArray(payload.items)) return payload.items;
  }
  return [];
}

function extractPagination(payload) {
  if (!payload || typeof payload !== "object" || Array.isArray(payload))
    return null;
  if (payload.pagination && typeof payload.pagination === "object") {
    const ipp =
      payload.pagination.items_per_page !== undefined
        ? payload.pagination.items_per_page
        : payload.pagination.pageSize !== undefined
          ? payload.pagination.pageSize
          : payload.pagination.page_size !== undefined
            ? payload.pagination.page_size
            : payload.pagination.per_page;
    if (typeof ipp === "number" && ipp > 0) {
      return {
        ...payload.pagination,
        items_per_page: ipp,
      };
    }
    return payload.pagination;
  }
  const directIpp =
    payload.items_per_page !== undefined
      ? payload.items_per_page
      : payload.pageSize !== undefined
        ? payload.pageSize
        : payload.page_size !== undefined
          ? payload.page_size
          : payload.per_page;
  if (typeof directIpp === "number" && directIpp > 0) {
    return {
      items_per_page: directIpp,
    };
  }
  return null;
}

function getPageItems(currentPage, totalPages) {
  if (totalPages <= 7) {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) pages.push(i);
    return pages;
  }
  if (currentPage <= 4) {
    return [1, 2, 3, 4, 5, "...", totalPages];
  }
  if (currentPage >= totalPages - 3) {
    return [
      1,
      "...",
      totalPages - 4,
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ];
  }
  return [
    1,
    "...",
    currentPage - 1,
    currentPage,
    currentPage + 1,
    "...",
    totalPages,
  ];
}

function renderPagination(
  container,
  tabIndex,
  totalItems,
  currentPage,
  totalPages,
  pageSize,
) {
  let paginationWrp = container.querySelector(".ptl-pagination-wrp");

  if (totalItems === 0 || totalPages <= 1) {
    if (paginationWrp) paginationWrp.remove();
    return;
  }

  if (!paginationWrp) {
    paginationWrp = document.createElement("div");
    paginationWrp.className = "ptl-pagination-wrp";

    const tableMain = container.querySelector(".creators-table-main");
    if (tableMain && tableMain.nextSibling) {
      container.insertBefore(paginationWrp, tableMain.nextSibling);
    } else {
      container.appendChild(paginationWrp);
    }
  }

  const effectivePageSize =
    typeof pageSize === "number" && pageSize > 0 ? pageSize : totalItems;
  const startItem =
    totalItems > 0 ? (currentPage - 1) * effectivePageSize + 1 : 0;
  const endItem = Math.min(currentPage * effectivePageSize, totalItems);
  const pageItems = getPageItems(currentPage, totalPages);

  const pageButtonsHTML = pageItems
    .map((p) => {
      if (p === "...") return `<span class="ptl-page-dots">...</span>`;
      const isActive = p === currentPage;
      return `<button type="button" class="ptl-page-num ${isActive ? "active" : ""}" data-page="${p}">${p}</button>`;
    })
    .join("");

  const showNavButtons = totalPages > 3;
  const prevButtonHTML = showNavButtons
    ? `<button type="button" class="ptl-page-btn ptl-prev-btn" data-page="prev" ${currentPage <= 1 ? "disabled" : ""}>Previous</button>`
    : "";
  const nextButtonHTML = showNavButtons
    ? `<button type="button" class="ptl-page-btn ptl-next-btn" data-page="next" ${currentPage >= totalPages ? "disabled" : ""}>Next</button>`
    : "";

  paginationWrp.innerHTML = `
<div class="ptl-pagination-info">
Showing <span class="ptl-pagination-range">${startItem}–${endItem}</span> of <span class="ptl-pagination-total">${totalItems}</span> traders
</div>
<div class="ptl-pagination-controls">
${prevButtonHTML}
<div class="ptl-page-numbers">${pageButtonsHTML}</div>
${nextButtonHTML}
<div class="ptl-pagination-goto">
<span class="ptl-goto-label">Go to</span>
<input type="number" class="ptl-goto-input" min="1" max="${totalPages}" step="1" inputmode="numeric" pattern="[0-9]*" placeholder="${currentPage}" aria-label="Go to page">
<button type="button" class="ptl-goto-btn">Go</button>
</div>
</div>
`;

  paginationWrp.querySelectorAll(".ptl-page-num").forEach((btn) => {
    btn.addEventListener("click", () => {
      const targetPage = parseInt(btn.getAttribute("data-page"), 10);
      if (
        !isNaN(targetPage) &&
        targetPage !== state.currentPageByTab[tabIndex]
      ) {
        goToPage(tabIndex, targetPage);
      }
    });
  });

  const prevBtn = paginationWrp.querySelector(".ptl-prev-btn");
  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      if (state.currentPageByTab[tabIndex] > 1) {
        goToPage(tabIndex, state.currentPageByTab[tabIndex] - 1);
      }
    });
  }

  const nextBtn = paginationWrp.querySelector(".ptl-next-btn");
  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      if (state.currentPageByTab[tabIndex] < totalPages) {
        goToPage(tabIndex, state.currentPageByTab[tabIndex] + 1);
      }
    });
  }

  const gotoInput = paginationWrp.querySelector(".ptl-goto-input");
  const gotoBtn = paginationWrp.querySelector(".ptl-goto-btn");

  function submitGoto() {
    if (!gotoInput) return;
    let clean = String(gotoInput.value).replace(/\D/g, "");
    let val = parseInt(clean, 10);
    if (isNaN(val) || val < 1) val = 1;
    if (val > totalPages) val = totalPages;
    gotoInput.value = val;
    if (val !== state.currentPageByTab[tabIndex]) {
      goToPage(tabIndex, val);
    }
  }

  if (gotoBtn) gotoBtn.addEventListener("click", submitGoto);
  if (gotoInput) {
    // Block non-numeric keystrokes: negative sign (-), plus (+), exponential (e, E), period (.), and injection characters
    gotoInput.addEventListener("keydown", (e) => {
      if (
        ["-", "+", "e", "E", ".", ","].includes(e.key) ||
        e.key === "<" ||
        e.key === ">"
      ) {
        e.preventDefault();
        return;
      }
      if (e.key === "Enter") {
        e.preventDefault();
        submitGoto();
      }
    });

    // Sanitize input, remove invalid characters, and clamp between 1 and totalPages
    gotoInput.addEventListener("input", () => {
      let clean = gotoInput.value.replace(/\D/g, "");
      if (clean !== "") {
        let num = parseInt(clean, 10);
        if (num < 1) num = 1;
        if (num > totalPages) num = totalPages;
        gotoInput.value = num;
      } else {
        gotoInput.value = "";
      }
    });

    // Prevent pasting invalid non-numeric text or malicious scripts
    gotoInput.addEventListener("paste", (e) => {
      e.preventDefault();
      const text =
        (e.clipboardData || window.clipboardData)?.getData("text") || "";
      const clean = text.replace(/\D/g, "");
      if (clean !== "") {
        let num = parseInt(clean, 10);
        if (num < 1) num = 1;
        if (num > totalPages) num = totalPages;
        gotoInput.value = num;
      } else {
        gotoInput.value = "";
      }
    });
  }
}

function goToPage(tabIndex, targetPage) {
  const config = PTL_CONFIG.apis[tabIndex];
  state.currentPageByTab[tabIndex] = targetPage;
  if (config && isApiEnabled(config)) {
    loadTabData(tabIndex, true, targetPage);
  } else {
    renderActiveTab(tabIndex);
  }

  document.getElementById(PTL_CONFIG.sectionId)?.scrollIntoView({
    block: "start",
    behavior: "smooth",
  });
}

function renderComingSoon(container, config) {
  if (!container) return;
  const existingPagination = container.querySelector(".ptl-pagination-wrp");
  if (existingPagination) existingPagination.remove();

  const titleText =
    (config &&
      (config.coming_soon_title || config.titleText || config.title)) ||
    "Coming Soon";
  const leagueName = (config && config.name) || "Open 2";
  const descText =
    (config &&
      (config.coming_soon_desc || config.coming_soon_text || config.desc)) ||
    "The game will begins on 26th October";

  container.innerHTML = `
<div class="ptl-coming-soon-main">
<div class="ptl-coming-soon-card">
<div class="ptl-coming-soon-badge">
<span class="ptl-coming-soon-dot"></span>
<span class="ptl-coming-soon-badge-txt">${escapeHtml(leagueName)}</span>
</div>
<h3 class="ptl-coming-soon-title">${escapeHtml(titleText)}</h3>
<p class="ptl-coming-soon-desc">${escapeHtml(descText)}</p>
</div>
</div>
`;
}

function setTableLeagueClass(container, config) {
  const table = container.querySelector(".creators-table");
  if (!table || !config) return;
  const leagueClass = config.id === "creator_league_2" ? "creator" : config.id;
  table.classList.remove("creator", "open2", "open1");
  if (["creator", "open2", "open1"].includes(leagueClass)) {
    table.classList.add(leagueClass);
  }

  const traderHeader = table.querySelector(
    ".creators-table-head .creators-table-col.trader",
  );
  const companyHeader = table.querySelector(
    ".creators-table-head .creators-table-col.company",
  );
  if (["open1", "open2"].includes(leagueClass) && !companyHeader) {
    traderHeader?.insertAdjacentHTML("afterend", `
<div class="creators-table-col company"><div class="creators-table-box head"><div class="creators-table-box-txt">Company</div></div></div>
`);
  } else if (leagueClass === "creator" && companyHeader) {
    companyHeader.remove();
  }

  const header = table.querySelector(
    ".creators-table-head .creators-table-col.points .creators-table-box-txt",
  );
  if (!header) return;
  const existingTooltip = header.querySelector(".creator-points-info");
  if (leagueClass !== "creator") {
    if (existingTooltip) existingTooltip.remove();
    return;
  }
  if (existingTooltip) return;

  const info = document.createElement("span");
  info.className = "creator-points-info";
  info.innerHTML = `
<button type="button" class="creator-points-info-btn" aria-label="About creator points" data-ptl-tooltip="The final points will be reconciled with the team points after the match ends.">i</button>
`;
  header.appendChild(info);
}

function ensureTableStructure(container, config) {
  if (!container) return;
  if (!container.querySelector(".creators-table-main")) {
    container.innerHTML = `
<div class="creators-table-main">
<div class="creators-table">
<div class="creators-table-head">
<div class="creators-table-row">
<div class="creators-table-col rank"><div class="creators-table-box head"><div class="creators-table-box-txt">Rank</div></div></div>
<div class="creators-table-col trader"><div class="creators-table-box head"><div class="creators-table-box-txt">Trader</div></div></div>
<div class="creators-table-col points"><div class="creators-table-box head"><div class="creators-table-box-txt">Points</div></div></div>
<div class="creators-table-col matches"><div class="creators-table-box head"><div class="creators-table-box-txt">Matches</div></div></div>
<div class="creators-table-col total"><div class="creators-table-box head"><div class="creators-table-box-txt">Total PnL</div></div></div>
<div class="creators-table-col reward"><div class="creators-table-box head last"><div class="creators-table-box-txt">Reward</div></div></div>
</div>
</div>
<div class="creators-table-body"></div>
</div>
</div>
`;
  }
  setTableLeagueClass(container, config);
}

function getLeaderboardFilters(config) {
  const tabIndex = Object.keys(PTL_CONFIG.apis).find(
    (key) => PTL_CONFIG.apis[key] === config,
  );
  return (
    state.filtersByTab[tabIndex] || {
      rank: "all",
      status: "all",
      company: "all",
    }
  );
}

function getFilterOptions(config) {
  if (!config?.filters) return {};
  const filters = getLeaderboardFilters(config);
  const rank = config.filters.rank?.options.find(
    (option) => option.value === filters.rank,
  );
  return {
    ...(rank?.start_rank !== undefined ? { start_rank: rank.start_rank } : {}),
    ...(rank?.end_rank !== undefined ? { end_rank: rank.end_rank } : {}),
    ...(config.filters.status && filters.status !== "all"
      ? { status: filters.status } : {}),
    ...(config.filters.company && filters.company && filters.company !== "all"
      ? { team_id: filters.company } : {}),
  };
}

function matchesLeaderboardFilters(item, config) {
  const options = getFilterOptions(config);
  if (options.team_id) {
    const teamId = item.team_id ?? item.team?.id ?? item.company?.id;
    if (teamId == null || String(teamId) !== String(options.team_id)) return false;
  }
  const rank = Number(item.rank);
  if (options.start_rank !== undefined && !(rank >= options.start_rank))
    return false;
  if (options.end_rank !== undefined && !(rank <= options.end_rank))
    return false;
  if (options.status) {
    const rawStatus = String(item.status || "")
      .trim()
      .toLowerCase();
    const status = config.filters.status.aliases?.[rawStatus] || rawStatus;
    if (status !== options.status) return false;
  }
  return true;
}

function initLeaderboardFilters(leaderboardEl, searchWrp) {
  let toolbar = leaderboardEl.querySelector(".ptl-leaderboard-controls");
  if (!toolbar) {
    toolbar = document.createElement("div");
    toolbar.className = "ptl-leaderboard-controls";
    searchWrp.parentNode.insertBefore(toolbar, searchWrp);
    toolbar.appendChild(searchWrp);
  }
  let filters = toolbar.querySelector(".ptl-leaderboard-filters");
  if (!filters) {
    filters = document.createElement("div");
    filters.className = "ptl-leaderboard-filters";
    toolbar.appendChild(filters);
  }
  const config = PTL_CONFIG.apis[state.activeTabIndex];
  if (filters.ptlFiltersConfig === config) return toolbar;
  filters.ptlFiltersConfig = config;
  // Always populate from configuration, replacing any saved dropdown markup.
  filters.innerHTML = Object.entries(config?.filters || {})
    .map(
      ([key, filter]) => `
<div class="ptl-filter" data-filter="${key}">
<button type="button" class="ptl-filter-trigger" aria-haspopup="listbox" aria-expanded="false" aria-controls="ptl-filter-${key}">
<span class="ptl-filter-label">${escapeHtml(filter.label)}: <span class="ptl-filter-value">All</span></span>
<svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="m4 6 4 4 4-4" stroke="currentColor" stroke-width="1.5"/></svg>
</button>
<ul id="ptl-filter-${key}" class="ptl-filter-options" role="listbox" aria-label="${escapeHtml(filter.label)}" hidden>
${filter.options.map((option) => `<li class="ptl-filter-option" role="option" tabindex="-1" aria-selected="${option.value === "all"}" data-value="${option.value}">${escapeHtml(option.label)}</li>`).join("")}
</ul>
</div>
`,
    )
    .join("");

  const closeAll = () => {
    filters.querySelectorAll(".ptl-filter").forEach((dropdown) => {
      dropdown
        .querySelector(".ptl-filter-trigger")
        .setAttribute("aria-expanded", "false");
      dropdown.querySelector("ul").hidden = true;
    });
  };
  filters.querySelectorAll(".ptl-filter").forEach((dropdown) => {
    const trigger = dropdown.querySelector("button");
    const menu = dropdown.querySelector("ul");
    const options = Array.from(menu.querySelectorAll("li"));
    const open = () => {
      closeAll();
      menu.hidden = false;
      trigger.setAttribute("aria-expanded", "true");
      (
        options.find(
          (option) => option.getAttribute("aria-selected") === "true",
        ) || options[0]
      ).focus();
    };
    const select = (option) => {
      const tabIndex = state.activeTabIndex;
      if (!state.filtersByTab[tabIndex]) return;
      state.filtersByTab[tabIndex][dropdown.dataset.filter] =
        option.dataset.value;
      state.currentPageByTab[tabIndex] = 1;
      closeAll();
      trigger.focus();
      updateSearchVisibility(leaderboardEl, PTL_CONFIG.apis[tabIndex]);
      loadTabData(tabIndex, true, 1);
    };
    trigger.addEventListener("click", () =>
      menu.hidden ? open() : closeAll(),
    );
    trigger.addEventListener("keydown", (event) => {
      if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        event.preventDefault();
        open();
      }
    });
    menu.addEventListener("click", (event) => {
      const option = event.target.closest('[role="option"]');
      if (option && menu.contains(option)) select(option);
    });
    menu.addEventListener("keydown", (event) => {
      const index = options.indexOf(document.activeElement);
      let next;
      if (event.key === "ArrowDown") next = (index + 1) % options.length;
      if (event.key === "ArrowUp")
        next = (index - 1 + options.length) % options.length;
      if (event.key === "Home") next = 0;
      if (event.key === "End") next = options.length - 1;
      if (next !== undefined) {
        event.preventDefault();
        options[next].focus();
      } else if ((event.key === "Enter" || event.key === " ") && index >= 0) {
        event.preventDefault();
        select(options[index]);
      } else if (event.key === "Escape") {
        event.preventDefault();
        closeAll();
        trigger.focus();
      }
    });
    dropdown.addEventListener("focusout", (event) => {
      if (!dropdown.contains(event.relatedTarget)) closeAll();
    });
  });
  if (!filters.ptlFiltersBound) {
    document.addEventListener("click", (event) => {
      if (!filters.contains(event.target)) closeAll();
    });
    filters.ptlFiltersBound = true;
  }
  return toolbar;
}

function injectSearchElement(leaderboardEl) {
  if (!leaderboardEl) return null;
  let searchWrp = leaderboardEl.querySelector(".input-search-wrp");
  if (!searchWrp) {
    searchWrp = document.createElement("div");
    searchWrp.className = "input-search-wrp";
    searchWrp.innerHTML = `
<input type="search" placeholder="Search trader" class="input-search">
<button type="button" class="input-search-btn" aria-label="Search trader" title="Search trader">
<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
<line x1="5" y1="12" x2="19" y2="12"></line>
<polyline points="12 5 19 12 12 19"></polyline>
</svg>
</button>
`;
    const tabMain = leaderboardEl.querySelector(".tab-cont-main");
    if (tabMain && tabMain.parentNode) {
      tabMain.parentNode.insertBefore(searchWrp, tabMain);
    } else {
      leaderboardEl.appendChild(searchWrp);
    }
    initSearch();
  } else if (!searchWrp.querySelector(".input-search-btn")) {
    const currentVal = searchWrp.querySelector(".input-search")
      ? searchWrp.querySelector(".input-search").value
      : "";
    searchWrp.innerHTML = `
<input type="search" placeholder="Search trader" class="input-search" value="${escapeHtml(sanitizeInput(currentVal))}">
<button type="button" class="input-search-btn" aria-label="Search trader" title="Search trader">
<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
<line x1="5" y1="12" x2="19" y2="12"></line>
<polyline points="12 5 19 12 12 19"></polyline>
</svg>
</button>
`;
    initSearch();
  }
  initLeaderboardFilters(leaderboardEl, searchWrp);
  return searchWrp;
}

function updateSearchVisibility(leaderboardEl, config) {
  if (!leaderboardEl) return;
  injectSearchElement(leaderboardEl);
  const searchWrp = leaderboardEl.querySelector(".input-search-wrp");
  const searchInput = leaderboardEl.querySelector(".input-search");
  const isComingSoonActive = isComingSoon(config);
  const isSearchConfigured = Boolean(
    config && config.id !== "creator_league_2" && config.showSearch !== false && !isComingSoonActive,
  );
  const toolbar = leaderboardEl.querySelector(".ptl-leaderboard-controls");
  const filters = toolbar.querySelector(".ptl-leaderboard-filters");
  const showFilters = Boolean(
    config?.filters && !isComingSoonActive,
  );
  toolbar.hidden = !isSearchConfigured && !showFilters;
  filters.hidden = !showFilters;
  const selectedFilters = getLeaderboardFilters(config);
  filters.querySelectorAll(".ptl-filter").forEach((dropdown) => {
    const key = dropdown.dataset.filter;
    const selected = selectedFilters[key];
    const option = config.filters[key].options.find(
      (item) => item.value === selected,
    );
    dropdown.querySelector(".ptl-filter-value").textContent = option?.label || "All";
    dropdown.querySelector("button").setAttribute("aria-expanded", "false");
    dropdown.querySelector("ul").hidden = true;
    dropdown.querySelectorAll("li").forEach((item) => {
      item.setAttribute(
        "aria-selected",
        String(item.dataset.value === selected),
      );
    });
  });

  if (searchWrp) {
    if (isSearchConfigured) {
      searchWrp.classList.add("is-visible");
      if (searchInput) searchInput.value = state.searchQuery;
    } else {
      searchWrp.classList.remove("is-visible");
      if (!isSearchConfigured) {
        if (searchInput) searchInput.value = "";
      }
    }
  }
}

async function resolveSourceData(
  config,
  page = 1,
  searchQuery = "",
  options = {},
) {
  if (!config) throw new Error("No configuration provided.");

  // If API switch is disabled, load static demo data
  if (!isApiEnabled(config)) {
    let demo = config.demo_data;
    if (
      !demo &&
      typeof PTL_DEMO_DATA !== "undefined" &&
      config.id &&
      PTL_DEMO_DATA[config.id]
    ) {
      demo = PTL_DEMO_DATA[config.id];
    }
    if (demo !== undefined && demo !== null) {
      let res = extractResults(demo);
      const query =
        searchQuery !== undefined && searchQuery !== null
          ? String(searchQuery).trim().toLowerCase()
          : "";
      if (query) {
        res = res.filter((item) => {
          const name = (
            item.display_handle ||
            item.username ||
            item.full_name ||
            item.trader_name ||
            item.name ||
            ""
          ).toLowerCase();
          return name.includes(query);
        });
      }
      return {
        results: res,
        pagination: extractPagination(demo),
        raw: demo,
      };
    }
    return {
      results: [],
      pagination: null,
      raw: null,
    };
  }

  // When is_live is true, resolve from API endpoint / source URL
  const source = config.ap_url || config.api_url || config.source;
  if (Array.isArray(source))
    return {
      results: source,
      pagination: null,
      raw: source,
    };
  if (source && typeof source === "object") {
    return {
      results: extractResults(source),
      pagination: extractPagination(source),
      raw: source,
    };
  }

  if (typeof source === "string" && source.trim() !== "") {
    const trimmed = source.trim();

    if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
      try {
        const parsed = JSON.parse(trimmed);
        return {
          results: extractResults(parsed),
          pagination: extractPagination(parsed),
          raw: parsed,
        };
      } catch (e) {
        throw new Error(`Invalid JSON data format: ${e.message}`);
      }
    }

    if (
      trimmed.startsWith("http://") ||
      trimmed.startsWith("https://") ||
      trimmed.startsWith("/")
    ) {
      let endpointUrl = trimmed;
      try {
        const parsedUrl = new URL(trimmed, window.location.href);
        if (
          config.usePagination !== false &&
          page !== undefined &&
          page !== null
        ) {
          parsedUrl.searchParams.set("page", page);
        }
        const q =
          searchQuery !== undefined && searchQuery !== null
            ? String(searchQuery).trim()
            : state.searchQuery
              ? String(state.searchQuery).trim()
              : "";
        if (q) {
          parsedUrl.searchParams.set("search", q);
        } else {
          parsedUrl.searchParams.delete("search");
        }
        if (options.start_rank !== undefined && options.start_rank !== null) {
          parsedUrl.searchParams.set("start_rank", options.start_rank);
        }
        if (options.end_rank !== undefined && options.end_rank !== null) {
          parsedUrl.searchParams.set("end_rank", options.end_rank);
        }
        if (options.start !== undefined && options.start !== null) {
          parsedUrl.searchParams.set("start", options.start);
        }
        if (options.end !== undefined && options.end !== null) {
          parsedUrl.searchParams.set("end", options.end);
        }
        if (options.status) {
          parsedUrl.searchParams.set(
            config.filters.status.apiParam,
            options.status,
          );
        }
        if (config.filters?.company) {
          const companyParam = config.filters.company.apiParam;
          if (options.team_id) parsedUrl.searchParams.set(companyParam, options.team_id);
          else parsedUrl.searchParams.delete(companyParam);
        }
        endpointUrl = parsedUrl.toString();
      } catch (e) {
        const params = [];
        if (
          config.usePagination !== false &&
          page !== undefined &&
          page !== null
        ) {
          params.push(`page=${encodeURIComponent(page)}`);
        }
        const q =
          searchQuery !== undefined && searchQuery !== null
            ? String(searchQuery).trim()
            : state.searchQuery
              ? String(state.searchQuery).trim()
              : "";
        if (q) {
          params.push(`search=${encodeURIComponent(q)}`);
        }
        if (options.start_rank !== undefined && options.start_rank !== null) {
          params.push(`start_rank=${encodeURIComponent(options.start_rank)}`);
        }
        if (options.end_rank !== undefined && options.end_rank !== null) {
          params.push(`end_rank=${encodeURIComponent(options.end_rank)}`);
        }
        if (options.status) {
          params.push(
            `${encodeURIComponent(config.filters.status.apiParam)}=${encodeURIComponent(options.status)}`,
          );
        }
        if (options.team_id && config.filters?.company) {
          params.push(
            `${encodeURIComponent(config.filters.company.apiParam)}=${encodeURIComponent(options.team_id)}`,
          );
        }
        const separator = trimmed.includes("?") ? "&" : "?";
        endpointUrl =
          params.length > 0
            ? `${trimmed}${separator}${params.join("&")}`
            : trimmed;
      }

      console.log(
        "[PTL Leaderboard] Fetching leaderboard endpoint:",
        endpointUrl,
      );
      const response = await fetch(endpointUrl, {
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(
          `Failed to fetch (${response.status}: ${response.statusText || "Server Error"})`,
        );
      }

      const data = await response.json();
      if (
        data &&
        data.success === false &&
        !Array.isArray(data.results) &&
        !Array.isArray(data.data)
      ) {
        throw new Error(data.message || "Leaderboard API returned an error.");
      }

      return {
        results: extractResults(data),
        pagination: extractPagination(data),
        raw: data,
      };
    }
  }

  // Fallback to demo_data if present
  let fallbackDemo = config.demo_data;
  if (
    !fallbackDemo &&
    typeof PTL_DEMO_DATA !== "undefined" &&
    config.id &&
    PTL_DEMO_DATA[config.id]
  ) {
    fallbackDemo = PTL_DEMO_DATA[config.id];
  }
  if (fallbackDemo !== undefined && fallbackDemo !== null) {
    return {
      results: extractResults(fallbackDemo),
      pagination: extractPagination(fallbackDemo),
      raw: fallbackDemo,
    };
  }

  throw new Error(
    `No valid API endpoint configured for ${config.name || "this tab"}.`,
  );
}

async function loadTabData(
  tabIndex,
  forceRefresh = false,
  page = null,
  searchQuery = null,
  options = {},
) {
  const config = PTL_CONFIG.apis[tabIndex];
  if (!config) return;

  const leaderboardEl = document.getElementById(PTL_CONFIG.sectionId);
  if (!leaderboardEl) return;

  const tabContainers = leaderboardEl.querySelectorAll(
    ".tab-cont-main > .tab-cont-each",
  );
  const container = tabContainers[tabIndex];
  if (!container) return;

  if (isComingSoon(config)) {
    renderComingSoon(container, config);
    updateSearchVisibility(leaderboardEl, config);
    return;
  }

  ensureTableStructure(container, config);

  const targetPage =
    page !== null && page !== undefined
      ? page
      : state.currentPageByTab[tabIndex] || 1;
  state.currentPageByTab[tabIndex] = targetPage;
  const targetSearch =
    config.showSearch && config.id !== "creator_league_2"
      ? (searchQuery !== null ? searchQuery : state.searchByTab[tabIndex] || "")
      : "";
  const filterOptions = getFilterOptions(config);
  const filterKey = JSON.stringify(filterOptions);

  if (
    config.loaded &&
    config.data &&
    config.currentPageLoaded === targetPage &&
    config.currentSearchLoaded === targetSearch &&
    config.currentFiltersLoaded === filterKey &&
    !forceRefresh
  ) {
    renderActiveTab(tabIndex);
    return;
  }

  const tableBody = container.querySelector(".creators-table-body");
  if (tableBody) tableBody.innerHTML = "";

  showLoading(container);
  updateSearchVisibility(leaderboardEl, config);
  const requestId = (config.requestId || 0) + 1;
  config.requestId = requestId;

  try {
    const payloadInfo = await resolveSourceData(
      config,
      targetPage,
      targetSearch,
      { ...options, ...filterOptions },
    );
    if (config.requestId !== requestId) return;
    config.data = payloadInfo.results;
    config.pagination = payloadInfo.pagination;
    config.currentPageLoaded = targetPage;
    config.currentSearchLoaded = targetSearch;
    config.currentFiltersLoaded = filterKey;
    config.loaded = true;
    if (state.activeTabIndex === tabIndex) renderActiveTab(tabIndex);
  } catch (err) {
    if (config.requestId !== requestId) return;
    console.error(
      `[PTL Leaderboard] Error loading data for tab ${config.name}:`,
      err,
    );
    config.loaded = false;
    config.data = null;
    config.pagination = null;
    if (state.activeTabIndex !== tabIndex) return;
    showError(
      container,
      tabIndex,
      err.message || `Failed to load ${config.name} leaderboard data.`,
    );
    updateSearchVisibility(leaderboardEl, config);
  }
}

/* PIECE 3 */
function renderActiveTab(tabIndex) {
  const config = PTL_CONFIG.apis[tabIndex];
  if (!config) return;

  const leaderboardEl = document.getElementById(PTL_CONFIG.sectionId);
  if (!leaderboardEl) return;

  const tabContainers = leaderboardEl.querySelectorAll(
    ".tab-cont-main > .tab-cont-each",
  );
  const container = tabContainers[tabIndex];
  if (!container) return;

  if (isComingSoon(config)) {
    renderComingSoon(container, config);
    updateSearchVisibility(leaderboardEl, config);
    return;
  }

  if (!config.data) return;

  ensureTableStructure(container, config);

  const tableBody = container.querySelector(".creators-table-body");
  if (!tableBody) return;

  const allResults = config.data || [];
  const isServerPaginated = Boolean(
    isApiEnabled(config) &&
    config.usePagination !== false &&
    config.pagination &&
    typeof config.pagination.total_pages === "number",
  );
  const query = config.showSearch && config.id !== "creator_league_2"
    ? (state.searchByTab[tabIndex] || "").trim().toLowerCase() : "";
  const searchedResults = query
    ? allResults.filter((item) => {
        const name = (
          item.display_handle ||
          item.username ||
          item.full_name ||
          item.trader_name ||
          item.name ||
          ""
        ).toLowerCase();
        return name.includes(query);
      })
    : allResults;
  // Live paginated responses must be filtered by the server before pagination.
  const filteredResults = isServerPaginated
    ? searchedResults
    : searchedResults.filter((item) => matchesLeaderboardFilters(item, config));
  updateSearchVisibility(leaderboardEl, config);

  const usePagination = Boolean(config && config.usePagination !== false);

  if (allResults.length === 0) {
    tableBody.innerHTML = `
<div class="creators-table-row empty-state">
<div class="empty-state-text">${query || Object.keys(getFilterOptions(config)).length ? "No traders match the current search and filters." : "No leaderboard data available at this time."}</div>
</div>
`;
    if (usePagination) renderPagination(container, tabIndex, 0, 1, 1);
    else {
      const existing = container.querySelector(".ptl-pagination-wrp");
      if (existing) existing.remove();
    }
    return;
  }

  if (filteredResults.length === 0) {
    tableBody.innerHTML = `
<div class="creators-table-row no-match">
<div class="no-match-text">No traders match the current search and filters.</div>
</div>
`;
    if (usePagination) renderPagination(container, tabIndex, 0, 1, 1);
    else {
      const existing = container.querySelector(".ptl-pagination-wrp");
      if (existing) existing.remove();
    }
    return;
  }

  // Non-Paginated Table (Creator League)
  if (!usePagination) {
    tableBody.innerHTML = filteredResults
      .map((item, idx) => createRowHTML(item, idx, tabIndex, idx))
      .join("");

    const existingPagination = container.querySelector(".ptl-pagination-wrp");
    if (existingPagination) existingPagination.remove();

    if (isModalEnabledForTab(tabIndex)) {
      tableBody
        .querySelectorAll('[data-action="open-modal"]')
        .forEach((cell) => {
          cell.addEventListener("click", (e) => {
            e.preventDefault();
            const rowIdx = parseInt(cell.getAttribute("data-row-idx"), 10);
            const item = filteredResults[rowIdx];
            const anchor = cell.querySelector("a[data-userid]");
            const userId =
              anchor?.dataset.userid ||
              (item &&
                (item.user_id !== undefined
                  ? item.user_id
                  : item.userId !== undefined
                    ? item.userId
                    : item.id));
            if (item || userId) {
              getDetailModal(tabIndex).open(item, tabIndex, userId);
            }
          });
        });
    }

    updateSearchVisibility(leaderboardEl, config);
    return;
  }

  // Paginated Table (Open 1 and Open 2)
  const totalItems =
    isServerPaginated && typeof config.pagination.count === "number"
      ? config.pagination.count
      : isServerPaginated &&
          typeof config.pagination.total_participants === "number"
        ? config.pagination.total_participants
        : filteredResults.length;

  const pageSize =
    config &&
    config.pagination &&
    typeof config.pagination.items_per_page === "number" &&
    config.pagination.items_per_page > 0
      ? config.pagination.items_per_page
      : config && typeof config.pageSize === "number" && config.pageSize > 0
        ? config.pageSize
        : typeof PTL_CONFIG.pageSize === "number" && PTL_CONFIG.pageSize > 0
          ? PTL_CONFIG.pageSize
          : 50;

  const totalPages =
    isServerPaginated &&
    typeof config.pagination.total_pages === "number" &&
    config.pagination.total_pages > 0
      ? config.pagination.total_pages
      : Math.max(1, Math.ceil(totalItems / pageSize));

  let currentPage =
    state.currentPageByTab[tabIndex] ||
    (config.pagination && config.pagination.current_page) ||
    1;
  if (currentPage > totalPages) currentPage = totalPages;
  if (currentPage < 1) currentPage = 1;
  state.currentPageByTab[tabIndex] = currentPage;

  const startIndex = (currentPage - 1) * pageSize;
  const pageItems = isServerPaginated
    ? filteredResults
    : filteredResults.slice(
        startIndex,
        Math.min(startIndex + pageSize, totalItems),
      );

  tableBody.innerHTML = pageItems
    .map((item, idx) => createRowHTML(item, startIndex + idx, tabIndex, idx))
    .join("");

  if (isModalEnabledForTab(tabIndex)) {
    tableBody.querySelectorAll('[data-action="open-modal"]').forEach((cell) => {
      cell.addEventListener("click", (e) => {
        e.preventDefault();
        const rowIdx = parseInt(cell.getAttribute("data-row-idx"), 10);
        const item = pageItems[rowIdx];
        const anchor = cell.querySelector("a[data-userid]");
        const userId =
          anchor?.dataset.userid ||
          (item &&
            (item.user_id !== undefined
              ? item.user_id
              : item.userId !== undefined
                ? item.userId
                : item.id));
        if (item || userId) {
          getDetailModal(tabIndex).open(item, tabIndex, userId);
        }
      });
    });
  }

  renderPagination(
    container,
    tabIndex,
    totalItems,
    currentPage,
    totalPages,
    pageSize,
  );
  updateSearchVisibility(leaderboardEl, config);
}


function initTabs() {
  const leaderboardEl = document.getElementById(PTL_CONFIG.sectionId);
  if (!leaderboardEl) return;

  const tabMain = leaderboardEl.querySelector(".tab-cont-main");
  const tabButtons = leaderboardEl.querySelectorAll(
    ".ptl-leader-tab-list .ptl-leader-tab-btn",
  );

  if (tabMain) {
    let tabContainers = tabMain.querySelectorAll(":scope > .tab-cont-each");
    for (let i = tabContainers.length; i < tabButtons.length; i++) {
      const newContainer = document.createElement("div");
      newContainer.className = "tab-cont-each";
      newContainer.innerHTML = `
                    <div class="creators-table-main">
                      <div class="creators-table">
                        <div class="creators-table-head">
                          <div class="creators-table-row">
                            <div class="creators-table-col rank"><div class="creators-table-box head"><div class="creators-table-box-txt">Rank</div></div></div>
                            <div class="creators-table-col trader"><div class="creators-table-box head"><div class="creators-table-box-txt">Trader</div></div></div>
                            <div class="creators-table-col points"><div class="creators-table-box head"><div class="creators-table-box-txt">Points</div></div></div>
                            <div class="creators-table-col matches"><div class="creators-table-box head"><div class="creators-table-box-txt">Matches</div></div></div>
                            <div class="creators-table-col total"><div class="creators-table-box head"><div class="creators-table-box-txt">Total PnL</div></div></div>
                            <div class="creators-table-col reward"><div class="creators-table-box head last"><div class="creators-table-box-txt">Reward</div></div></div>
                          </div>
                        </div>
                        <div class="creators-table-body"></div>
                      </div>
                    </div>
                `;
      const notes = tabMain.querySelector(".ldr-btm-wrp");
      if (notes) {
        tabMain.insertBefore(newContainer, notes);
      } else {
        tabMain.appendChild(newContainer);
      }
    }
  }

  const tabContainers = leaderboardEl.querySelectorAll(
    ".tab-cont-main > .tab-cont-each",
  );

  tabContainers.forEach((container, index) => {
    setTableLeagueClass(container, PTL_CONFIG.apis[index]);
    if (index === state.activeTabIndex) {
      container.classList.add("active");
    } else {
      container.classList.remove("active");
    }
  });

  tabButtons.forEach((btn, index) => {
    if (index === state.activeTabIndex) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }

    btn.onclick = (e) => {
      e.preventDefault();

      leaderboardEl.scrollIntoView({
        block: "start",
        behavior: "smooth",
      });

      if (state.activeTabIndex === index && PTL_CONFIG.apis[index].loaded)
        return;

      state.activeTabIndex = index;

      tabButtons.forEach((b, i) => {
        if (i === index) b.classList.add("active");
        else b.classList.remove("active");
      });

      const currentContainers = leaderboardEl.querySelectorAll(
        ".tab-cont-main > .tab-cont-each",
      );
      currentContainers.forEach((container, i) => {
        if (i === index) container.classList.add("active");
        else container.classList.remove("active");
      });

      updateSearchVisibility(leaderboardEl, PTL_CONFIG.apis[index]);
      loadTabData(index);
    };
  });
}

function initSearch() {
  const leaderboardEl = document.getElementById(PTL_CONFIG.sectionId);
  if (!leaderboardEl) return;

  const searchInput = leaderboardEl.querySelector(".input-search");
  const searchBtn = leaderboardEl.querySelector(".input-search-btn");
  if (!searchInput) return;

  if (searchInput.ptlSearchBound) return;
  searchInput.ptlSearchBound = true;
  searchInput.dataset.searchBound = "true";

  const executeSearch = (query) => {
    if (!PTL_CONFIG.apis[state.activeTabIndex]?.showSearch ||
        PTL_CONFIG.apis[state.activeTabIndex].id === "creator_league_2") return;
    const sanitized = sanitizeInput(query);
    state.searchQuery =
      sanitized !== undefined && sanitized !== null
        ? String(sanitized).trim()
        : "";
    state.currentPageByTab[state.activeTabIndex] = 1;

    const config = PTL_CONFIG.apis[state.activeTabIndex];
    if (config && isApiEnabled(config)) {
      loadTabData(state.activeTabIndex, true, 1, state.searchQuery);
    } else {
      renderActiveTab(state.activeTabIndex);
    }
  };

  if (searchBtn) {
    searchBtn.addEventListener("click", (e) => {
      e.preventDefault();
      executeSearch(searchInput.value);
    });
  }

  // Prevent typing dangerous injection characters (<, >)
  searchInput.addEventListener("keydown", (e) => {
    if (e.key === "<" || e.key === ">") {
      e.preventDefault();
      return;
    }
    if (e.key === "Enter") {
      e.preventDefault();
      executeSearch(e.target.value);
    } else if (e.key === "Escape") {
      e.target.value = "";
      executeSearch("");
    }
  });

  // Real-time input sanitization: remove any script tags, malicious code, or disallowed characters
  searchInput.addEventListener("input", (e) => {
    const cleanVal = sanitizeInput(e.target.value);
    if (e.target.value !== cleanVal) {
      e.target.value = cleanVal;
    }
    if (e.target.value.trim() === "" && state.searchQuery !== "") {
      executeSearch("");
    }
  });

  // Handle pasting: prevent malicious script injection on paste
  searchInput.addEventListener("paste", (e) => {
    e.preventDefault();
    const pastedText =
      (e.clipboardData || window.clipboardData)?.getData("text") || "";
    const cleanText = sanitizeInput(pastedText);
    const start = searchInput.selectionStart || 0;
    const end = searchInput.selectionEnd || 0;
    const curVal = searchInput.value;
    const nextVal = curVal.slice(0, start) + cleanText + curVal.slice(end);
    searchInput.value = sanitizeInput(nextVal);
    const newCursorPos = start + cleanText.length;
    searchInput.setSelectionRange(newCursorPos, newCursorPos);
    if (searchInput.value.trim() === "" && state.searchQuery !== "") {
      executeSearch("");
    }
  });

  // Handle clearing the search field via the native clear button
  searchInput.addEventListener("search", (e) => {
    const cleanVal = sanitizeInput(e.target.value);
    if (e.target.value !== cleanVal) {
      e.target.value = cleanVal;
    }
    if (e.target.value.trim() === "" && state.searchQuery !== "") {
      executeSearch("");
    }
  });
}

window.PTLLeaderboard = {
  setDefaultTab: function (tabIndex) {
    const idx = parseInt(tabIndex, 10);
    if (PTL_CONFIG.apis[idx]) {
      PTL_CONFIG.defaultTabIndex = idx;
      state.activeTabIndex = idx;
      initTabs();
      updateSearchVisibility(
        document.getElementById(PTL_CONFIG.sectionId),
        PTL_CONFIG.apis[idx],
      );
      loadTabData(idx);
    }
  },

  setSearch: function (tabIndex, enabled) {
    if (PTL_CONFIG.apis[tabIndex]) {
      PTL_CONFIG.apis[tabIndex].showSearch =
        PTL_CONFIG.apis[tabIndex].id !== "creator_league_2" && !!enabled;
      if (state.activeTabIndex === tabIndex) {
        const leaderboardEl = document.getElementById(PTL_CONFIG.sectionId);
        updateSearchVisibility(leaderboardEl, PTL_CONFIG.apis[tabIndex]);
        renderActiveTab(tabIndex);
      }
    }
  },

  setTraderModal: function (enabled) {
    PTL_CONFIG.enableTraderModal = !!enabled;
    renderActiveTab(state.activeTabIndex);
  },

  setTabTraderModal: function (tabIndex, enabled) {
    if (PTL_CONFIG.apis[tabIndex]) {
      PTL_CONFIG.apis[tabIndex].enableTraderModal = !!enabled;
      if (state.activeTabIndex === tabIndex) {
        renderActiveTab(tabIndex);
      }
    }
  },

  setPagination: function (tabIndex, enabled) {
    if (PTL_CONFIG.apis[tabIndex]) {
      PTL_CONFIG.apis[tabIndex].usePagination = !!enabled;
      if (state.activeTabIndex === tabIndex) {
        renderActiveTab(tabIndex);
      }
    }
  },

  setSource: function (tabIndex, source) {
    if (PTL_CONFIG.apis[tabIndex]) {
      PTL_CONFIG.apis[tabIndex].source = source;
      PTL_CONFIG.apis[tabIndex].ap_url = source;
      PTL_CONFIG.apis[tabIndex].api_url = source;
      PTL_CONFIG.apis[tabIndex].loaded = false;
      if (state.activeTabIndex === tabIndex) {
        loadTabData(tabIndex, true);
      }
    }
  },

  setApiUrl: function (tabIndex, url) {
    if (PTL_CONFIG.apis[tabIndex]) {
      PTL_CONFIG.apis[tabIndex].ap_url = url;
      PTL_CONFIG.apis[tabIndex].api_url = url;
      PTL_CONFIG.apis[tabIndex].source = url;
      PTL_CONFIG.apis[tabIndex].loaded = false;
      if (
        state.activeTabIndex === tabIndex &&
        PTL_CONFIG.apis[tabIndex].is_live
      ) {
        loadTabData(tabIndex, true);
      }
    }
  },

  setLive: function (tabIndex, isLive) {
    if (PTL_CONFIG.apis[tabIndex]) {
      PTL_CONFIG.apis[tabIndex].is_live = !!isLive;
      PTL_CONFIG.apis[tabIndex].loaded = false;
      if (state.activeTabIndex === tabIndex) {
        loadTabData(tabIndex, true);
      }
    }
  },

  setComingSoon: function (tabIndex, isComingSoonVal) {
    if (PTL_CONFIG.apis[tabIndex]) {
      PTL_CONFIG.apis[tabIndex].coming_soon = !!isComingSoonVal;
      if (state.activeTabIndex === tabIndex) {
        loadTabData(tabIndex, true);
      }
    }
  },

  setDemoData: function (tabIndex, demoData) {
    if (PTL_CONFIG.apis[tabIndex]) {
      PTL_CONFIG.apis[tabIndex].demo_data = demoData;
      PTL_CONFIG.apis[tabIndex].loaded = false;
      if (
        state.activeTabIndex === tabIndex &&
        !PTL_CONFIG.apis[tabIndex].is_live
      ) {
        loadTabData(tabIndex, true);
      }
    }
  },

  setPageSize: function (size) {
    const s = parseInt(size, 10);
    if (!isNaN(s) && s > 0) {
      PTL_CONFIG.pageSize = s;
      renderActiveTab(state.activeTabIndex);
    }
  },

  goToPage: function (page) {
    goToPage(state.activeTabIndex, page);
  },

  openTraderModal: function (item, tabIndex) {
    const index = tabIndex !== undefined ? tabIndex : state.activeTabIndex;
    getDetailModal(index).open(item, index);
  },

  closeTraderModal: function () {
    TraderDetailModal.close();
    CreatorDetailModal.close();
  },

  openCreatorModal: function (item, userId) {
    return CreatorDetailModal.open(item, 2, userId);
  },

  refresh: function () {
    loadTabData(state.activeTabIndex, true);
  },

  getApiBaseUrl: function () {
    return getApiBaseUrl();
  },

  getConfig: function () {
    return PTL_CONFIG;
  },

  getState: function () {
    return state;
  },
};

function initLeaderboardTooltips() {
  if (document.getElementById("ptl-body-tooltip")) return;
  const tooltip = document.createElement("span");
  tooltip.id = "ptl-body-tooltip";
  tooltip.className = "ptl-body-tooltip";
  tooltip.setAttribute("role", "tooltip");
  tooltip.hidden = true;
  document.body.appendChild(tooltip);
  let activeTrigger = null;
  let hideTimer;

  function hide() {
    clearTimeout(hideTimer);
    if (activeTrigger) activeTrigger.removeAttribute("aria-describedby");
    activeTrigger = null;
    tooltip.hidden = true;
  }

  function position() {
    if (!activeTrigger) return;
    if (!activeTrigger.isConnected || !activeTrigger.getClientRects().length) {
      hide();
      return;
    }
    const rect = activeTrigger.getBoundingClientRect();
    const center = rect.left + rect.width / 2;
    const width = tooltip.offsetWidth;
    const height = tooltip.offsetHeight;
    const left = Math.max(
      8,
      Math.min(center - width / 2, window.innerWidth - width - 8),
    );
    const above =
      rect.bottom + height + 16 > window.innerHeight && rect.top > height + 16;
    tooltip.classList.toggle("is-above", above);
    tooltip.style.left = `${left}px`;
    tooltip.style.top = `${above ? rect.top - height - 8 : rect.bottom + 8}px`;
    tooltip.style.setProperty(
      "--caret-left",
      `${Math.max(10, Math.min(center - left, width - 10))}px`,
    );
  }

  function show(event) {
    const trigger = event.target.closest?.("[data-ptl-tooltip]");
    if (!trigger) return;
    clearTimeout(hideTimer);
    if (activeTrigger && activeTrigger !== trigger) hide();
    activeTrigger = trigger;
    tooltip.textContent = trigger.dataset.ptlTooltip;
    trigger.setAttribute("aria-describedby", tooltip.id);
    tooltip.hidden = false;
    position();
  }

  function scheduleHide(event) {
    if (!activeTrigger) return;
    const next = event.relatedTarget;
    if (next && (activeTrigger.contains(next) || tooltip.contains(next)))
      return;
    clearTimeout(hideTimer);
    hideTimer = setTimeout(hide, 120);
  }

  document.addEventListener("mouseover", show);
  document.addEventListener("focusin", show);
  document.addEventListener("click", (event) => {
    if (event.target.closest?.("[data-ptl-tooltip]")) show(event);
    else if (!tooltip.contains(event.target)) hide();
  });
  document.addEventListener("mouseout", scheduleHide);
  document.addEventListener("focusout", scheduleHide);
  tooltip.addEventListener("mouseenter", () => clearTimeout(hideTimer));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") hide();
  });
  window.addEventListener("scroll", position, true);
  window.addEventListener("resize", position);
  new MutationObserver(() => {
    if (activeTrigger && !activeTrigger.isConnected) hide();
  }).observe(document.getElementById(PTL_CONFIG.sectionId) || document.body, {
    childList: true,
    subtree: true,
  });
}

function init() {
  initImageFallbacks();
  initLeaderboardTooltips();
  initTabs();
  initSearch();
  TraderDetailModal.init();
  CreatorDetailModal.init();
  loadTabData(state.activeTabIndex);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
