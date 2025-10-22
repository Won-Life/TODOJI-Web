export interface DeadlineData {
  type: 'date' | 'period';
  startDate?: Date;
  endDate?: Date;
  period?: string;
  hasDeadline?: boolean; // for sub-goals with checkbox
}

export interface ActionItem {
  id: number;
  text: string;
  selectedDays: string[];
}

export interface SubGoalData {
  title: string;
  deadline: DeadlineData;
  criteriaType: 'self-check' | 'count';
  countValue?: string;
  actions: ActionItem[];
}

export interface FinalGoalData {
  title: string;
  imageUrl?: string;
  deadline: DeadlineData;
}

export interface GoalSettingFormData {
  finalGoal: FinalGoalData;
  subGoal1: SubGoalData;
  subGoal2: SubGoalData;
  subGoal3: SubGoalData;
  villageName: string;
}
