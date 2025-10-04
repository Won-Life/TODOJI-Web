'use client'

import dynamic from 'next/dynamic'

import {useState} from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// import TextField from '@mui/material/TextField';

const LocalizationProvider = dynamic(() => import('@mui/x-date-pickers/LocalizationProvider').then(module => module.LocalizationProvider), { ssr: false })
const DatePicker = dynamic(() => import('@mui/x-date-pickers/DatePicker').then(module => module.DatePicker), { ssr: false })


export default function DatePickerCalendar () {
  const [value, setValue] = useState(null);

  if (!AdapterDayjs || typeof AdapterDayjs === 'undefined') {
      // 로딩 중이거나 임포트 실패 시 null 또는 로딩 UI 반환
      return <div>날짜 선택기 로딩 중...</div>;
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker label="Basic date picker" value ={value}/>
    </LocalizationProvider>
  );
}