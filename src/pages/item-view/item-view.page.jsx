import { faChevronLeft, faEdit } from '@fortawesome/free-solid-svg-icons';
import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { Avatar, Dialog, IconButton } from '../../components';
import MobileLayout from '../../layouts/mobile.layout';
import { fetchItem } from '../../utils/server';

const ItemViewPage = () => {
	const [item, setItem] = useState(null);
	const { id } = useParams();

	const history = useHistory();

	useEffect(() => {
		(async () => {
			const item = await fetchItem(id);
			setItem(item);
		})();
	}, []);

	useEffect(() => window.scrollTo(0, 0), []);

	if (!item) return null;

	return (
		<Dialog>
			<MobileLayout
				style={{
					background: 'var(--background)',
				}}
				top={
					<Dialog.Header
						style={{
							display: 'grid',
							gridTemplateColumns: 'repeat(3, 1fr)',
							justifyItems: 'center',
							alignItems: 'center',
							background: 'var(--surface)',
							color: 'var(--on-surface)',
						}}
					>
						<IconButton
							icon={faChevronLeft}
							style={{
								justifySelf: 'start',
							}}
							onClick={() => {
								history.push('/items');
							}}
						/>

						<h2
							style={{
								textAlign: 'center',
								margin: '24px 0',
							}}
						>
							View
						</h2>
						<IconButton
							icon={faEdit}
							style={{
								justifySelf: 'end',
							}}
							noBorder
							size='lg'
							onClick={() => {
								history.push(`/items/${id}/edit`);
							}}
						/>
					</Dialog.Header>
				}
			>
				<Dialog.Content>
					<div
						style={{
							textAlign: 'center',
							marginTop: '26px',
						}}
					>
						<div style={{ display: 'flex', justifyContent: 'center' }}>
							<Avatar
								src={item.image}
								size='xl'
								style={{
									marginRight: '16px',
								}}
							/>
						</div>
						<h1
							style={{
								overflow: 'hidden',
								textOverflow: 'ellipsis',
							}}
						>
							{item.name || <small>{item.id}</small>}
						</h1>
						<div>
							<small>
								Created:{' '}
								<strong>{new Date(item.created).toLocaleString()}</strong>
							</small>
						</div>
						<small>
							<strong>{item.type}</strong>
						</small>
					</div>
					<div
						style={{
							margin: '16px',
						}}
					>
						<hr
							style={{
								margin: '16px 0',
								borderColor: 'var(--inactive)',
							}}
						/>

						<div>
							{item.tags && item.tags.length > 0
								? `#${item.tags.join(', #')}`
								: ''}
						</div>
						<div>{item.description}</div>
					</div>
				</Dialog.Content>
			</MobileLayout>
		</Dialog>
	);
};

export default ItemViewPage;
