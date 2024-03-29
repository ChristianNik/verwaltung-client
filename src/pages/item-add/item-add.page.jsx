import { faTimes, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import React, { useMemo } from 'react';
import { Route, useHistory } from 'react-router-dom';
import {
	Avatar,
	Dialog,
	Hashtags,
	IconButton,
	Input,
	Rating,
	RouteAnimationWrapper,
} from '../../components';
import Button from '../../components/button/button.component';
import { useItems } from '../../context/items.context';
import { useLanguage } from '../../context/language.context';
import useAddItem from '../../hooks/use-add-item';
import useScrollTop from '../../hooks/use-scroll-top';
import MobileLayout from '../../layouts/mobile.layout';

const ItemAdd = () => {
	useScrollTop();
	const { lang } = useLanguage();
	const { items, addItem } = useItems();
	const history = useHistory();
	const { formData, addTag, removeTag, handleInputChange, handleSelectImage } =
		useAddItem();

	const handleTypeChange = (value) => {
		handleInputChange({
			target: {
				name: 'type',
				value: value,
			},
		});
	};

	const handleAddItem = async (e) => {
		e.preventDefault();

		await addItem(formData);
		history.push('/items');
	};

	const itemTypes = useMemo(() => {
		const types = items.reduce((acc, item) => {
			const types = [...acc, item.type];
			const typesSet = new Set(types);
			typesSet.delete('');
			return [...typesSet];
		}, []);

		const typeCounts = items.reduce((acc, item) => {
			acc[item.type] = (acc[item.type] || 0) + 1;
			return acc;
		}, {});

		return types.sort((a, b) => (typeCounts[b] || 0) - (typeCounts[a] || 0));
	}, [items]);

	const prevPage = () => {
		history.goBack();
	};

	return (
		<RouteAnimationWrapper>
			<MobileLayout
				style={{
					background: 'var(--background)',
				}}
				top={
					<Dialog.Header
						style={{
							display: 'flex',
							alignItems: 'center',
							background: 'var(--surface)',
							color: 'var(--on-surface)',
						}}
					>
						<Route exact path='/items/add'>
							<IconButton
								size='lg'
								icon={faTimes}
								onClick={() => {
									history.push('/items');
								}}
							/>
						</Route>
						<Route exact path={['/items/add/details', '/items/add/valuation']}>
							<IconButton
								color='var(--primary)'
								size='lg'
								icon={faArrowLeft}
								onClick={prevPage}
							/>
						</Route>

						<h2
							style={{
								textAlign: 'center',
								margin: '24px 0',
							}}
						>
							<Route exact path='/items/add'>
								{lang('ui/items/add', 'typeTabTitle')}
							</Route>
							<Route exact path='/items/add/details'>
								{lang('ui/items/add', 'detailsTabTitle')}
							</Route>
							<Route exact path='/items/add/valuation'>
								{lang('ui/items/add', 'valuationTabTitle')}
							</Route>
						</h2>
					</Dialog.Header>
				}
				bottom={
					<Dialog.Header
						style={{
							padding: '16px',
							display: 'grid',
							gap: '8px',
						}}
					>
						<Route exact path='/items/add'>
							<Button
								active={formData.type}
								disabled={!formData.type}
								onClick={() => history.push(`/items/add/details`)}
							>
								{lang('ui/items/add', 'nextLabel')}
							</Button>
						</Route>
						<Route exact path='/items/add/details'>
							<Button
								active
								onClick={() => history.push(`/items/add/valuation`)}
							>
								{lang('ui/items/add', 'nextLabel')}
							</Button>
						</Route>
						<Route exact path='/items/add/valuation'>
							<Button primary onClick={handleAddItem}>
								{lang('ui/items/add', 'add')}
							</Button>
						</Route>
						<Button secondary onClick={() => history.push('/items')}>
							Cancel
						</Button>
					</Dialog.Header>
				}
			>
				<Dialog.Header
					style={{
						padding: '16px',
						overflow: 'auto',
					}}
				>
					<form
						onSubmit={handleAddItem}
						style={{
							display: 'grid',
							gap: '8px',
						}}
					>
						<Route exact path='/items/add'>
							<div
								style={{
									overflow: 'hidden',
								}}
							>
								<ul
									style={{
										listStyle: 'none',
										display: 'grid',
										gap: '8px',
										overflow: 'hidden',
										color: 'inherit',
									}}
								>
									{itemTypes.map((type) => {
										return (
											<li key={type}>
												<Button
													active={formData.type === type}
													style={{
														'--btn-fg': 'var(--inactive)',
														'--btn-border-color': 'currentcolor',
														'--btn-bg': 'transparent',
													}}
													onClick={() => {
														handleTypeChange(type);
													}}
													onDoubleClick={() => {
														handleTypeChange(type);
														history.push(`/items/add/details`);
													}}
												>
													{type}
												</Button>
											</li>
										);
									})}
								</ul>
							</div>
						</Route>

						<Route exact path='/items/add/details'>
							<>
								<div style={{ display: 'flex', justifyContent: 'center' }}>
									<Avatar
										src={formData.image}
										size='xl'
										onClick={handleSelectImage}
										style={{
											marginRight: '16px',
										}}
									/>
								</div>
								<hr
									style={{
										margin: '16px 0',
										borderColor: 'var(--inactive)',
									}}
								/>
								<Hashtags
									text={lang('ui/items/add', 'tagsCaption')}
									tags={formData.tags}
									onSubmit={addTag}
									onRemove={removeTag}
								/>

								<Input
									name='description'
									text={lang('ui/items/add', 'descriptionCaption')}
									value={formData.description}
									onChange={handleInputChange}
								/>
							</>
						</Route>

						<Route exact path='/items/add/valuation'>
							<Rating
								text={lang('ui/items/add', 'convenienceCaption')}
								name='valuationConvenience'
								onChange={handleInputChange}
							/>
							<Rating
								text={lang('ui/items/add', 'appearanceCaption')}
								name='valuationAppearance'
								onChange={handleInputChange}
							/>
						</Route>
					</form>
				</Dialog.Header>
			</MobileLayout>
		</RouteAnimationWrapper>
	);
};

export default ItemAdd;
