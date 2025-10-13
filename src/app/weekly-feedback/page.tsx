'use client'

import { useState } from "react";
import WeeklyFeedbackModalContent from "../components/WeeklyFeedbackModalContent"

export default function Page () {
  const [isClose, setIsClose] = useState(false);

  const closeModal = () => {
    setIsClose(false);
  }
  return (
    <WeeklyFeedbackModalContent onClose={closeModal} villageName={'뭐시기 마을'}/>
  )
}