import React, { useState, useEffect, useCallback } from 'react';
import Multiselect from 'multiselect-react-dropdown';
import axios from 'axios';
import { Button, TextField } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export const Dashboard = () => {
  const quarterHeight = `${(3 * window.innerHeight) / 4}px`;
  const [options, setOptions] = useState([]);
  const [selectedValues, setSelectedValues] = useState([]);
  const [stocks, setStocks] = useState([]);
  const [stockPrices, setStockPrices] = useState({});
  const [holdings, setHoldings] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${API_BASE_URL}/stocks/seed`)
      .then(response => {
        const transformedOptions = response.data.map(stock => ({
          name: `${stock.stockName} (${stock.stockSymbol})`,
          id: stock._id,
          symbol: stock.stockSymbol,
        }));
        setOptions(transformedOptions);
      })
      .catch(error => console.error("Error fetching stocks:", error));

    axios.get(`${API_BASE_URL}/stocks/selected-stock`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
      .then(response => {
        const transformedOptions = response.data.map(stock => ({
          name: `${stock.stock.stockName} (${stock.stock.stockSymbol})`,
          id: stock.stock._id,
          symbol: stock.stock.stockSymbol,
          quantity: stock.quantity,
          buyingPrice: stock.buyingPrice
        }));
        setSelectedValues(transformedOptions);
        setStocks(transformedOptions);
        fetchStockPrices(transformedOptions);

        const initialHoldings = {};
        transformedOptions.forEach(stock => {
          initialHoldings[stock.id] = {
            quantity: stock.quantity,
            buyingPrice: stock.buyingPrice
          };
        });
        setHoldings(initialHoldings);
      })
      .catch(error => console.error("Error fetching selected stocks:", error));
  }, []);

  const fetchStockPrices = useCallback((stocks) => {
    stocks.forEach(stock => {
      axios.get(`${API_BASE_URL}/stocks/quote-equity?symbol=${stock.symbol}`)
        .then(response => {
          setStockPrices(prevState => ({
            ...prevState,
            [stock.symbol]: response.data
          }));
        })
        .catch(error => console.error(`Error fetching price for ${stock.symbol}:`, error));
    });
  }, []);

  const navigateToTimeline = useCallback((id) => {
    navigate(`/notes/${id}`);
  }, [navigate]);

  const onSelect = useCallback((selectedList) => {
    setSelectedValues(selectedList);
    setStocks(selectedList);
    axios.post(`${API_BASE_URL}/stocks/selected-stock`, { selectedStocks: selectedList.map(stock => stock.id) }, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
    .then(() => fetchStockPrices(selectedList))
    .catch(error => console.error("Error updating selected stocks:", error));
  }, [fetchStockPrices]);

  const onRemove = useCallback((selectedList) => {
    setSelectedValues(selectedList);
    setStocks(selectedList);
    axios.post(`${API_BASE_URL}/stocks/selected-stock`, { selectedStocks: selectedList.map(stock => stock.id) }, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
    .then(() => fetchStockPrices(selectedList))
    .catch(error => console.error("Error updating selected stocks:", error));
  }, [fetchStockPrices]);

  const handleHoldingChange = useCallback((id, field, value) => {
    setHoldings(prevState => ({
      ...prevState,
      [id]: {
        ...prevState[id],
        [field]: value
      }
    }));
  }, []);

  const handleHoldingBlur = useCallback((id) => {
    const holding = holdings[id];
  axios.put(`${API_BASE_URL}/stocks/update`, { stockId: id, ...holding }, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  })
  .catch(error => {
    console.error("Error updating holding:", error);
  });
  }, [holdings]);

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-7 m-7">
        <div className="col-span-1 lg:col-span-2 border-2 border-slate-500 rounded-3xl mr-7 p-4 shadow-md mb-8" style={{ height: quarterHeight }}>
          <div className="grid grid-rows-3 h-full">
            <div className="row-span-1">
              <Multiselect
                options={options}
                selectedValues={selectedValues}
                onSelect={onSelect}
                onRemove={onRemove}
                displayValue="name"
                placeholder="Select share"
                emptyRecordMsg="No share selected"
                showArrow
                style={{
                  searchBox: {
                    borderRadius: '10px',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                    maxHeight: '180px', 
                    overflowY: 'auto', 
                  },
                  inputField: {
                    marginLeft: '8px'
                  },
                  optionContainer: {
                    border: '1px solid #d3d3d3',
                    borderRadius: '10px',
                    boxShadow: '0px 1px 3px 0px #bdbdbd',
                    maxHeight: '150px',
                  },
                  option: {
                    fontSize: '14px',
                    padding: '8px 12px',
                  },
                  list: {
                    fontWeight: 400
                  }
                }}
              />
            </div>
            <div className="row-span-2 mt-4 border-t-2 border-slate-500 pt-4 overflow-y-auto">
              <h2 className="text-center mb-4 font-semibold text-xl text-gray-700">NOTES</h2>
              <ul>
                {stocks.length > 0 ? (
                  stocks.map(stock => (
                    <li key={stock.id} className="flex justify-between items-center p-4 border-b border-slate-300">
                      <span className="text-base font-medium text-blue-700">{stock.name}</span>
                      <Button
                        variant="contained"
                        color="primary"
                        endIcon={<SendIcon />}
                        sx={{ padding: '2px 6px', minWidth: '35px', marginRight: '10px' }}
                        onClick={() => navigateToTimeline(stock.id)}
                      />
                    </li>
                  ))
                ) : (
                  <li className="text-center text-gray-500">No stocks selected</li>
                )}
              </ul>
            </div>
          </div>
        </div>
        <div className="col-span-1 lg:col-span-5 border-2 border-slate-500 rounded-3xl shadow-md mr-4 ml-4 overflow-y-auto" style={{ height: quarterHeight }}>
          <h2 className="text-center mt-4 mb-5 font-semibold text-xl text-gray-700">HOLDINGS</h2>
          <div className="p-1">
            <div className=" hidden lg:grid grid-cols-6 items-center ml-5 mr-5 p-2 border-b border-t border-gray-400 gap-3 mt-3 mb-3">
                <div className="col-span-2 font-semibold text-gray-600">Name</div>
                <div className="col-span-1 font-semibold text-gray-600">Cur.val</div>
                <div className="col-span-1 text-center font-semibold text-gray-600">Qty.</div>
                <div className="col-span-1 text-center font-semibold text-gray-600">Avg.val</div>
                <div className="col-span-1 text-center font-semibold text-gray-600">P&L</div>
            </div>
            {/* mobile view */}
            <div className="lg:hidden grid grid-cols-4 items-center ml-5 mr-5 p-2 border-b border-t border-gray-400 gap-3 mt-3 mb-3">
            <div className="col-span-1 font-semibold text-gray-600">Name</div>
            <div className="col-span-1 font-semibold text-gray-600">Qty / Avg.val</div>
            <div className="col-span-1 font-semibold text-gray-600">Cur.val</div>
            <div className="col-span-1 font-semibold text-gray-600">P&L</div>
          </div>
            {stocks.length > 0 ? (
              <ul>
                {stocks.map(stock => (
                  <li key={stock.id} >
                 <div className=" hidden lg:grid grid-cols-6 items-center ml-5 mr-5 p-2 border-b border-slate-300 gap-3">
                    <h5 className=" lg:col-span-2 font-medium text-gray-800">{stock.name}</h5>
                    <h5 className=" lg:col-span-1 font-medium text-gray-700">{stockPrices[stock.symbol] ? `₹${stockPrices[stock.symbol]}` : 'Fetching price...'}</h5>
                    <TextField
                      className="lg:col-span-1"
                      label="Quantity"
                      variant="outlined"
                      size="small"
                      style={{ margin: '2px 0', width: '80%' }}
                      value={holdings[stock.id]?.quantity || ''}
                      onChange={(e) => handleHoldingChange(stock.id, 'quantity', e.target.value)}
                      onBlur={() => handleHoldingBlur(stock.id)}
                    />
                    <TextField
                      className=" lg:col-span-1"
                      label="Buying Price"
                      variant="outlined"
                      size="small"
                      style={{ margin: '2px 8px', width: '80%' }}
                      value={holdings[stock.id]?.buyingPrice || ''}
                      onChange={(e) => handleHoldingChange(stock.id, 'buyingPrice', e.target.value)}
                      onBlur={() => handleHoldingBlur(stock.id)}
                    />
                    <span className={`lg:col-span-1 text-center ${holdings[stock.id]?.quantity && holdings[stock.id]?.buyingPrice && (stockPrices[stock.symbol] - holdings[stock.id].buyingPrice) > 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {holdings[stock.id]?.quantity && holdings[stock.id]?.buyingPrice ? ` ₹${((stockPrices[stock.symbol] - holdings[stock.id].buyingPrice) * holdings[stock.id].quantity).toFixed(2)}` : ''}
                    </span>
                 </div>
                    {/* mobile view */}
                  <div className="lg:hidden grid grid-cols-4 items-center ml-5 mr-5 p-2 border-b border-slate-300 gap-3">
                    <h5 className=" col-span-1 font-medium text-gray-800 overflow-x-auto">{stock.name}</h5>
                    <div className=" col-span-1 flex flex-col sm:flex-row">
                      <TextField
                        label="Quantity"
                        variant="outlined"
                        size="small"
                        style={{ margin: '2px 0', width: '100%' }}
                        value={holdings[stock.id]?.quantity || ''}
                      onChange={(e) => handleHoldingChange(stock.id, 'quantity', e.target.value)}
                      onBlur={() => handleHoldingBlur(stock.id)}
                      />
                      <TextField
                        label="Buying Price"
                        variant="outlined"
                        size="small"
                        style={{ margin: '2px 0', width: '100%' }}
                        value={holdings[stock.id]?.buyingPrice || ''}
                        onChange={(e) => handleHoldingChange(stock.id, 'buyingPrice', e.target.value)}
                        onBlur={() => handleHoldingBlur(stock.id)}
                      />
                    </div>
                    <h5 className=" col-span-1 font-medium text-gray-700">{stockPrices[stock.symbol] ? `₹${stockPrices[stock.symbol]}` : 'Fetching price...'}</h5>
                    <span className={`col-span-1 text-center ${holdings[stock.id]?.quantity && holdings[stock.id]?.buyingPrice && (stockPrices[stock.symbol] - holdings[stock.id].buyingPrice) > 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {holdings[stock.id]?.quantity && holdings[stock.id]?.buyingPrice ? ` ₹${((stockPrices[stock.symbol] - holdings[stock.id].buyingPrice) * holdings[stock.id].quantity).toFixed(2)}` : ''}
                    </span>
                  </div>
                 </li>  
                ))}
              </ul>
            ) : (
              <p className="text-center text-gray-500">No stocks selected</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
