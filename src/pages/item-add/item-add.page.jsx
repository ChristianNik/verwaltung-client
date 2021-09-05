import { faTimes, faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import React, { useEffect, useMemo } from 'react';
import { Route, useHistory } from 'react-router-dom';
import {
	Avatar,
	Dialog,
	Hashtags,
	IconButton,
	Input,
	Rating,
} from '../../components';
import Button from '../../components/button/button.component';
import { useItems } from '../../context/items.context';
import { useLanguage } from '../../context/language.context';
import useAddItem from '../../hooks/use-add-item';
import MobileLayout from '../../layouts/mobile.layout';

const Wrapper = (props) => (
	<div
		style={{
			width: '100%',
			margin: '0 auto',
			maxWidth: '600px',
			overflow: 'auto',
			height: '100%',
			background: 'var(--background)',
			color: 'var(--on-background)',
		}}
		{...props}
	/>
);

const ItemAdd = () => {
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

	useEffect(() => window.scrollTo(0, 0), []);

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
		<Dialog>
			<MobileLayout
				style={{
					background: 'var(--background-app)',
				}}
				top={
					<Wrapper>
						<div
							style={{
								display: 'flex',
								alignItems: 'center',
							}}
						>
							<Route exact path='/items/add'>
								<IconButton
									icon={faTimes}
									onClick={() => {
										history.push('/items');
									}}
								/>
							</Route>
							<Route
								exact
								path={['/items/add/details', '/items/add/valuation']}
							>
								<IconButton icon={faChevronLeft} onClick={prevPage} />
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
						</div>
					</Wrapper>
				}
				bottom={
					<Wrapper>
						<div
							style={{
								padding: '16px',
							}}
						>
							<Route exact path='/items/add'>
								<Button
									style={{
										...(formData.type && {
											'--btn-bg': 'var(--primary)',
											'--btn-fg': 'var(--on-primary)',
										}),
									}}
									disabled={!formData.type}
									onClick={() => history.push(`/items/add/details`)}
								>
									{lang('ui/items/add', 'nextLabel')}
								</Button>
							</Route>
							<Route exact path='/items/add/details'>
								<Button onClick={() => history.push(`/items/add/valuation`)}>
									{lang('ui/items/add', 'nextLabel')}
								</Button>
							</Route>
							<Route exact path='/items/add/valuation'>
								<Button onClick={handleAddItem}>
									{lang('ui/items/add', 'add')}
								</Button>
							</Route>
						</div>
					</Wrapper>
				}
			>
				<Wrapper>
					<div
						style={{
							padding: '16px',
							overflow: 'auto',
						}}
					>
						<form onSubmit={handleAddItem}>
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
											color: 'var(--inactive)',
										}}
									>
										{itemTypes.map((type) => {
											return (
												<li key={type}>
													<Button
														style={{
															'--btn-border-color': 'gray',
															'--btn-bg': 'transparent',
															...(formData.type === type && {
																'--btn-border-color': 'var(--primary)',
																'--btn-fg': 'var(--on-primary)',
																'--btn-bg': 'var(--primary)',
															}),
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
											borderColor: 'red',
										}}
									/>
									<h3>{lang('ui/items/add', 'tagsCaption')}</h3>
									<Hashtags
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
					</div>
				</Wrapper>
			</MobileLayout>
		</Dialog>
	);
};

export default ItemAdd;
