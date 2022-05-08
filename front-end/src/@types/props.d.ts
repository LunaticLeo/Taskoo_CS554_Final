import { SxProps, Theme } from '@mui/material';
import { BarSeriesOption, PieSeriesOption, SunburstSeriesOption, TreemapSeriesOption } from 'echarts/charts';
import {
	DataZoomComponentOption,
	GraphicComponentOption,
	GridComponentOption,
	LegendComponentOption,
	TooltipComponentOption
} from 'echarts/components';
import { ComposeOption } from 'echarts/core';
import { Form } from './form';
import { OptionsObject, SnackbarKey, VariantType } from 'notistack';
import React from 'react';

type Notification = Record<VariantType, (msg: string, options?: OptionsObject) => SnackbarKey>;

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
type Option = ComposeOption<
	| GraphicComponentOption
	| PieSeriesOption
	| BarSeriesOption
	| TreemapSeriesOption
	| SunburstSeriesOption
	| TooltipComponentOption
	| LegendComponentOption
	| GridComponentOption
	| DataZoomComponentOption
>;

type LangButtonProps = WithSxProp<{}>;

type LoadingProps = { open: boolean };
type LogoProps = { fontSize?: number; color?: string };

type StyledStatusProps = WithSxProp<{ label: string; variant?: 'filled' | 'outlined'; size?: 'small' | 'medium' }>;
type StyledAccountInfoProps = Partial<Account> & { component?: React.ElementType<any>; onClick?: () => void };
type StyledAvatarGroupProps = {
	data: Required<Pick<Account, 'avatar' | 'firstName' | 'lastName'>>[];
	max?: number;
};
type StyledDialogProps = { open: boolean; onClose: React.Dispatch<React.SetStateAction<boolean>> };
type TableListProps<T extends { _id: string; [prop: string]: any }> = WithSxProp<{
	showHeader?: boolean;
	header: (keyof T)[];
	data: T[] | Record<keyof T, any>[];
	size?: 'small' | 'medium';
	pageConfig?: PageConfig;
	onPageChange?: (event: React.ChangeEvent<unknown>, value: number) => void;
}>;
type WithPage<T> = { count: number; list: T };
type PageConfig = {
	pageSize: number;
	pageNum: number;
	count?: number;
};

type DashboardProps = {
	category: 'project' | 'task';
	setCategoty: React.Dispatch<React.SetStateAction<'project' | 'task'>>;
};

type TaskColumnData = Record<Lowercase<StaticStatus>, Task[]>;
type TasksProps = WithSxProp<{
	data: TaskColumnData;
	setData: (value: React.SetStateAction<TaskColumnData>) => void;
	permission: boolean;
	[props: string]: any;
}>;
type TaskColumnProps = { status: string; data: Task[]; permission: boolean };
type TaskCardProps = WithSxProp<{
	data: Task;
	clickable?: boolean;
	deleteable?: boolean;
	onDelete?: (id: string) => void;
}>;
type DetailDialogProps = StyledDialogProps & { data: Task };

type TabPanelProps = { value: string | number; hidden: boolean; [props: string]: any };
type TabsProps = { text: string; value: string | number };

type ProjectFileUploadProps = { project: string };
type ProjectFormDialogProps = { refresh?: () => void };
type ProjectMemberListProps = {
	data: Account<string>[];
	members: WithRole<{ _id: string }>[];
	setMembers: (value: React.SetStateAction<Form.ProjectForm>) => void;
};

type NavBreadcrumbsProps = { projectName: string };
type FavoriteButtonProps = { favorite: boolean; onClick?: () => void };
type TaskFormDialogProps = {
	project: string;
	members: WithRole<Account<StaticData>, StaticData>[];
	refresh?: () => void;
	emitUpdate: () => void;
};
type TaskMemberListProps = {
	data: WithRole<Account<StaticData>, StaticData>[];
	setMembers: (value: React.SetStateAction<Form.TaskForm>) => void;
};

type FileUploaderProps = WithSxProp<{ onFileSelected: (files: File[]) => void; size?: number }>;
type FolderProps = { filesUrl: string[] };
type FileItemProps = { fileUrl: string };
type FileListProps = WithSxProp<{ files: File[]; onDelete: (index: number) => void }>;

type ContactDisplayType = 'list' | 'treemap' | 'sunburst';
type RelationsChartProps = { data: Account<StaticData>[]; type?: 'treemap' | 'sunburst' };
type ContactsProps = { data: Account<StaticData>[] };
type ContactListProps = WithSxProp<ContactsProps & { dense?: boolean; filteable?: boolean }>;
type ContactListItemProps = { data: Account<StaticData> };

type CalendarView = 'day' | 'week' | 'month';
