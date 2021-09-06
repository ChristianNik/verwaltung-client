import React, { Suspense } from 'react';
import './App.css';

import { Route, Switch } from 'react-router-dom';
import { Sidebar } from './components';
import MobileLayout from './layouts/mobile.layout';
import useTotalHeight from './hooks/use-total-height';
import { GridLoader } from 'react-spinners';
import { useThemeAutoSwitcher } from './hooks/use-theme';

const DashboardPage = React.lazy(() => import('./pages/dashboard'));
const ItemsPage = React.lazy(() => import('./pages/items/items.page'));
const SettingsPage = React.lazy(() => import('./pages/settings'));
const ItemAddDialog = React.lazy(() => import('./pages/item-add'));
const ItemEditDialog = React.lazy(() => import('./pages/item-edit'));
const ItemViewDialog = React.lazy(() => import('./pages/item-view'));

function App() {
	useTotalHeight();
	useThemeAutoSwitcher();

	return (
		<MobileLayout
			style={{
				background: 'var(--background)',
			}}
			bottom={<Sidebar />}
		>
			<div
				style={{
					margin: '0 auto',
					padding: '16px',
					overflow: 'auto',
					height: '100%',
					background: 'var(--background)',
				}}
			>
				<div
					style={{
						maxWidth: 'var(--app-max-mobile-width, 600px)',
						margin: '0 auto',
						height: '100%',
					}}
				>
					<Suspense
						fallback={
							<div
								style={{
									display: 'flex',
									height: '100%',
									justifyContent: 'center',
									alignItems: 'center',
								}}
							>
								<GridLoader color='var(--inactive)' />
							</div>
						}
					>
						<Switch>
							<Route path='/items/add' component={ItemAddDialog} />
							<Route exact path='/items/:id/edit' component={ItemEditDialog} />
							<Route exact path='/items/:id' component={ItemViewDialog} />
						</Switch>

						<Switch>
							<Route exact path='/' component={DashboardPage} />
							<Route exact path='/items' component={ItemsPage} />
							<Route exact path='/settings' component={SettingsPage} />
						</Switch>
					</Suspense>
				</div>
			</div>
		</MobileLayout>
	);
}

export default App;
