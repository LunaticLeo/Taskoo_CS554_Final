import { SxProps, Theme } from '@mui/material';
import { PieSeriesOption } from 'echarts/charts';
import { GraphicComponentOption, LegendComponentOption, TooltipComponentOption } from 'echarts/components';
import { ComposeOption } from 'echarts/core';
import { Form } from './form';

type WithSxProp<T> = T & { sx?: SxProps<Theme> };

type NavProps = {
	openDrawer: boolean;
	setOpenDrawer: React.Dispatch<React.SetStateAction<boolean>>;
};

type ImgSrc = 401 | 403 | 404 | 500;
type ErrorProps = { message?: string; code?: number | string };

type AvatarMenuProps = WithSxProp<{}>;
type CardProps = { title?: string };
type CardTitleProps = { component?: React.ElementType<any> };

type ChartProps = WithSxProp<{
	option: Option;
	height?: string;
	width?: string;
}>;
type Option = ComposeOption<GraphicComponentOption | PieSeriesOption | TooltipComponentOption | LegendComponentOption>;

type LangButtonProps = WithSxProp<{}>;

type LoadingProps = { open: boolean };
type LogoProps = { fontSize?: number; color?: string };

type StyledStatusProps = { label: string };
type StyledAccountInfoProps = Partial<Account> & { component?: React.ElementType<any> };
type StyledAvatarGroupProps = { data: Account[]; max?: number };
type StyledDialogProps = { open: boolean; onClose: React.Dispatch<React.SetStateAction<boolean>> };
type TableListProps<T extends { _id: string; [prop: string]: any }> = {
	showHeader?: boolean;
	header: (keyof T)[];
	data: T[] | Record<keyof T, any>[];
	size?: 'small' | 'medium';
};

type Draggable<T> = T & { index: number };
type TasksProps = WithSxProp<{ data: Record<StaticStatus, TaskInfo[]> }>;
type TaskColumnProps = { status: string; data: TaskInfo[] };
type TaskCardProps = WithSxProp<{ data: TaskInfo }>;
type DraggableTaskCardProps = { data: TaskInfo; index: number };

type TabPanelProps = { value: string | number; hidden: boolean; [props: string]: any };
type TabsProps = { text: string; value: string | number };

type ProjectMemberListProps = {
	data: Account<string>[];
	members: WithRole<{ _id: string }>[];
	setMembers: (value: React.SetStateAction<Form.ProjectForm>) => void;
};

type NavBreadcrumbsProps = { projectName: string };
type FavoriteButtonProps = { favorite: boolean; onClick?: () => void };
type TaskFormDialogProps = { project: string; members: WithRole<Account<StaticData>, StaticData>[] };
type TaskMemberListProps = {
	data: WithRole<Account<StaticData>, StaticData>[];
	setMembers: (value: React.SetStateAction<Form.TaskForm>) => void;
};
