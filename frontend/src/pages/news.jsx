import React, { useState, useEffect } from 'react';
import axios from 'axios';

const apiKey = import.meta.env.VITE_NEWSAPI_KEY
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export const News = () => {
  const quarterHeight = `${(3 * window.innerHeight) / 4}px`;
  const [news, setNews] = useState({});
  const [marketMoves, setMarketMoves] = useState([]);

  useEffect(() => {
    fetchMarketMoves();
    axios.get(`${API_BASE_URL}/stocks/selected-stock`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
      .then(response => {
        const transformedOptions = response.data.map(stock => ({
          name: `${stock.stock.stockName}`,
          id: stock.stock._id,
        }));
        fetchNews(transformedOptions);
      })
      .catch(error => console.error("Error fetching selected stocks:", error));
  }, []);

  const fetchNews = (stocks) => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const fromDate = oneWeekAgo.toISOString().split('T')[0];
    const toDate = new Date().toISOString().split('T')[0];

    const newsPromises = stocks.map(stock => {
      let stockName = stock.name.split(' ')[0];
      const stockName2 = stock.name.split(' ')[1];
      if(stockName2!==undefined){
        stockName = '+'+stockName+'+'+stockName2;
      }
      const url = `https://newsapi.org/v2/everything?q=${stockName}&language=en&from=${fromDate}&to=${toDate}&sortBy=relevancy&searchIn=title,description&pageSize=5&apiKey=${apiKey}`;
      return axios.get(url).then(response => ({
        stockName: stock.name,
        articles: response.data.articles
      }));
    });

    Promise.all(newsPromises)
      .then(responses => {
        const newsByStock = responses.reduce((acc, { stockName, articles }) => {
          const filteredArticles = filterNews(articles);
          if (filteredArticles.length > 0) {
            acc[stockName] = filteredArticles;
          }
          return acc;
        }, {});
        setNews(newsByStock);
      })
      .catch(error => console.error("Error fetching news:", error));
  };

  const fetchMarketMoves = () => {
    const url = `https://newsapi.org/v2/top-headlines?category=business&pageSize=20&language=en&apiKey=${apiKey}`;
    axios.get(url)
      .then(response => {
        // console.log(response)
        const filteredA=filterNews(response.data.articles)
        setMarketMoves(filteredA)
  })
      .catch(error => console.error("Error fetching market moves:", error));
  };

  const filterNews = (articles) => {
    return articles.filter(article => {
      const isPlaceholderTitle = article.title && article.title.toLowerCase().includes('removed');
      const isPlaceholderDescription = article.description && article.description.toLowerCase().includes('removed');
      return !(isPlaceholderTitle || isPlaceholderDescription);
    });
  };

  const customStyle = {
    newsContainer: {
      height: quarterHeight,
      overflowY: 'scroll',
      padding: '20px',
      paddingLeft: '35px'
    },
    newsItem: {
      marginBottom: '10px',
      lineHeight: '1.5',
      // listStyleType: 'disc',
    },
    newsItem2: {
      marginBottom: '30px',
      lineHeight: '1.5',
      // listStyleType: 'disc',
    },
    heading: {
      fontWeight: 600,
      cursor: 'pointer',
      color: '#007BFF',
    },
    list: {
      fontWeight: 400
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-8 m-7">
        <div className="col-span-1 lg:col-span-3 border-2 border-slate-500 rounded-3xl mr-7 p-4 shadow-md mb-8 overflow-y-auto" style={{ height: quarterHeight }}>
          <div className='ml-4'>
            <h2 className="text-center mb-4 font-semibold text-xl text-gray-700">Market Moves</h2>
            <ul>
              {marketMoves.length > 0 ? (
                marketMoves.map((move, index) => (
                  <li key={index} style={customStyle.newsItem2}>
                    <a href={move.url} target="_blank" rel="noopener noreferrer">
                      <h3 style={customStyle.heading}>{move.title}</h3>
                    </a>
                    <p style={customStyle.list}>{move.description}</p>
                  </li>
                ))
              ) : (
                <li>No market moves available</li>
              )}
            </ul>
          </div>
        </div>
        <div className="col-span-1 lg:col-span-5 border-2 border-slate-500 rounded-3xl shadow-md" style={{ height: quarterHeight }}>
          <div style={customStyle.newsContainer} className='overflow-y-auto'>
            <h2 className="text-center mb-4 font-semibold text-xl text-gray-700">Daily Digest</h2>
            <ul>
              {Object.keys(news).length > 0 ? (
                Object.keys(news).map((stockName, index) => (
                  <li key={index} style={customStyle.newsItem2}>
                    <div className='text-gray-900 font-semibold mb-1'>{stockName}</div>
                    <ul>
                      {news[stockName].map((article, idx) => (
                        <li key={idx} style={customStyle.newsItem}>
                          <a href={article.url} target="_blank" rel="noopener noreferrer">
                            <h4 style={customStyle.heading}>{article.title}</h4>
                          </a>
                          <p style={customStyle.list}>{article.description}</p>
                        </li>
                      ))}
                    </ul>
                  </li>
                ))
              ) : (
                <li>No news available</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};
