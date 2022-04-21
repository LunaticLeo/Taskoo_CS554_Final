import { SxProps, Theme } from '@mui/material';

type WithSxProp<T> = T & { sx?: SxProps<Theme> };

type TasksProps = WithSxProp<{ data: Record<StaticStatus, TaskInfo[]> }>;
type TaskColumnProps = { status: string; data: TaskInfo[] };
type DraggableTaskCardProps = { data: TaskInfo; index: number };
