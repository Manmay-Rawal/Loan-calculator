import React, { useState, useEffect } from 'react';
import {
  TextField, Button, Box, Typography, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Paper, Grid, MenuItem
} from '@mui/material';
import axios from 'axios';

const Calculator = () => {
  const [loan, setLoan] = useState('');
  const [rate, setRate] = useState('');
  const [tenure, setTenure] = useState('');
  const [emi, setEmi] = useState(null);
  const [totalInterest, setTotalInterest] = useState(null);
  const [totalPayment, setTotalPayment] = useState(null);

  const [scheduleINR, setScheduleINR] = useState([]);
  const [convertedSchedule, setConvertedSchedule] = useState([]);

  const [targetCurrency, setTargetCurrency] = useState('USD');
  const [rates, setRates] = useState({});

  useEffect(() => {
    fetchRates();
  }, []);

  useEffect(() => {
    if (scheduleINR.length > 0) {
      convertScheduleToCurrency(scheduleINR, targetCurrency);
    }
  }, [targetCurrency, rates]);

  const fetchRates = async () => {
    try {
      const response = await axios.get(
        `https://v6.exchangerate-api.com/v6/${import.meta.env.VITE_EXCHANGE_API_KEY}/latest/INR`
      );
      setRates(response.data.conversion_rates);
    } catch (error) {
      console.error('Error fetching rates:', error);
    }
  };

  const calculateEMI = () => {
    const P = parseFloat(loan);
    const R = parseFloat(rate) / 12 / 100;
    const N = parseFloat(tenure) * 12;

    const emiValue = (P * R * Math.pow(1 + R, N)) / (Math.pow(1 + R, N) - 1);
    const totalPay = emiValue * N;
    const totalInt = totalPay - P;

    setEmi(emiValue.toFixed(2));
    setTotalInterest(totalInt.toFixed(2));
    setTotalPayment(totalPay.toFixed(2));

    generateSchedule(P, R, N, emiValue);
  };

  const generateSchedule = (P, R, N, emiValue) => {
    let balance = P;
    const schedule = [];

    for (let i = 1; i <= N; i++) {
      const interest = balance * R;
      const principal = emiValue - interest;
      balance -= principal;

      schedule.push({
        month: i,
        principal: principal,
        interest: interest,
        balance: Math.max(balance, 0),
      });
    }

    setScheduleINR(schedule);
    convertScheduleToCurrency(schedule, targetCurrency);
  };

  const convertScheduleToCurrency = (scheduleINR, currency) => {
    const rate = rates[currency] || 1;

    const converted = scheduleINR.map((item) => ({
      ...item,
      principal: (item.principal * rate).toFixed(2),
      interest: (item.interest * rate).toFixed(2),
      balance: (item.balance * rate).toFixed(2),
    }));

    setConvertedSchedule(converted);
  };

  const handleReset = () => {
    setLoan('');
    setRate('');
    setTenure('');
    setEmi(null);
    setTotalInterest(null);
    setTotalPayment(null);
    setScheduleINR([]);
    setConvertedSchedule([]);
    setTargetCurrency('USD');
  };

  return (
    <Box>
      <Grid container spacing={2}>
        <Grid size={{xs:12,sm:4}}>
          <TextField
            fullWidth
            label="Loan Amount (INR)"
            variant="outlined"
            value={loan}
            onChange={(e) => setLoan(e.target.value)}
          />
        </Grid>
        <Grid size={{xs:12,sm:4}}>
          <TextField
            fullWidth
            label="Annual Interest Rate (%)"
            variant="outlined"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
          />
        </Grid>
        <Grid size={{xs:12,sm:4}}>
          <TextField
            fullWidth
            label="Loan Tenure (Years)"
            variant="outlined"
            value={tenure}
            onChange={(e) => setTenure(e.target.value)}
          />
        </Grid>
      </Grid>

      <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
        <Button variant="contained" color="primary" onClick={calculateEMI}>
          Calculate
        </Button>
      </Box>

      {emi && (
        <Box mt={4}>
          <Typography variant="h6">Loan Summary (INR)</Typography>
          <Typography>Monthly EMI: ₹{emi}</Typography>
          <Typography>Total Interest: ₹{totalInterest}</Typography>
          <Typography>Total Payment: ₹{totalPayment}</Typography>
        </Box>
      )}

      {convertedSchedule.length > 0 && (
        <Box mt={5}>
          <Typography variant="h6" gutterBottom>
            Amortization Schedule ({targetCurrency})
          </Typography>

          <TextField
            select
            label="Currency"
            value={targetCurrency}
            onChange={(e) => setTargetCurrency(e.target.value)}
            sx={{ mb: 2, width: 150 }}
          >
            {['USD', 'EUR', 'GBP', 'AUD', 'CAD', 'JPY','INR'].map((currency) => (
              <MenuItem key={currency} value={currency}>
                {currency}
              </MenuItem>
            ))}
          </TextField>
          <Box sx={{ display: 'flex', gap: 2 }}>
          <Button variant="outlined" color="secondary" onClick={handleReset}>
          Reset
        </Button>
        </Box>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Month</TableCell>
                  <TableCell>Principal</TableCell>
                  <TableCell>Interest</TableCell>
                  <TableCell>Balance</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {convertedSchedule.map((row, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{row.month}</TableCell>
                    <TableCell>{row.principal}</TableCell>
                    <TableCell>{row.interest}</TableCell>
                    <TableCell>{row.balance}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}
    </Box>
  );
};

export default Calculator;
