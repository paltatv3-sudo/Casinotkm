import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CurrencyFormatter = ({ amount }) => {
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('tk-TM', {
      style: 'currency',
      currency: 'TMT',
      minimumFractionDigits: 2
    }).format(value);
  };

  return <span>{formatCurrency(amount)}</span>;
};

export default CurrencyFormatter;
