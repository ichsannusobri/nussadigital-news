'use client';

import TradingViewWidget from './TradingViewWidget';

const OVERVIEW = {
  dateRange: '1M',
  showChart: true,
  showSymbolLogo: true,
  showFloatingTooltip: true,
  tabs: [
    {
      title: 'APAC Indices',
      symbols: [
        { s: 'IDX:COMPOSITE', d: 'Jakarta Composite (IHSG)' },
        { s: 'TVC:NI225', d: 'Nikkei 225' },
        { s: 'TVC:HSI', d: 'Hang Seng' },
        { s: 'SSE:000001', d: 'Shanghai Composite' },
        { s: 'ASX:XJO', d: 'S&P/ASX 200' },
        { s: 'TVC:KOSPI', d: 'KOSPI' },
      ],
    },
    {
      title: 'Currencies',
      symbols: [
        { s: 'FX_IDC:USDIDR', d: 'USD/IDR' },
        { s: 'FX:USDJPY', d: 'USD/JPY' },
        { s: 'FX_IDC:USDCNY', d: 'USD/CNY' },
        { s: 'FX_IDC:USDSGD', d: 'USD/SGD' },
        { s: 'FX:AUDUSD', d: 'AUD/USD' },
      ],
    },
    {
      title: 'Commodities',
      symbols: [
        { s: 'TVC:GOLD', d: 'Gold' },
        { s: 'TVC:UKOIL', d: 'Brent Crude' },
        { s: 'TVC:SILVER', d: 'Silver' },
        { s: 'COMEX:HG1!', d: 'Copper' },
      ],
    },
    {
      title: 'Global',
      symbols: [
        { s: 'FOREXCOM:SPXUSD', d: 'S&P 500' },
        { s: 'TVC:DXY', d: 'US Dollar Index' },
        { s: 'TVC:US10Y', d: 'US 10Y Yield' },
        { s: 'BITSTAMP:BTCUSD', d: 'Bitcoin' },
      ],
    },
  ],
};

const CALENDAR = {
  importanceFilter: '0,1',
  countryFilter: 'id,jp,cn,au,kr,in,sg,us',
};

export function MarketsOverviewPanel() {
  return <TradingViewWidget widget="market-overview" config={OVERVIEW} height={560} title="APAC markets overview" />;
}

export function EconomicCalendarPanel() {
  return <TradingViewWidget widget="events" config={CALENDAR} height={520} title="APAC economic calendar" />;
}
