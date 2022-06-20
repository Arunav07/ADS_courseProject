import '../css/App.css';
import { Link, Route, Switch } from 'react-router-dom';
import { algoList, algoMap } from '../AlgoList';
import Header from '../components/Header';
import ParticleFile from './Particle';
import React from 'react';

const HomeScreen = () => {
	return (
		<div className="container">
			<Header />
			{/* <div style={{position: "absolute"}}>
    <ParticleFile  />
  </div> */}
			<div className="content">
				<Switch>
					<Route exact path="/">
						<div className="outer-flex">
							<div className="inner-flex">
								{algoList.map((name, index) =>
									algoMap[name] ? (
										<Link to={`/${name}`} key={index}>
											<input
												className="button"
												type="button"
												value={algoMap[name][0]}
											/>
										</Link>
									) : (
										<div key={index} className="divider">
											<span>{name}</span>
										</div>
									),
								)}
							</div>
						</div>
					</Route>
				</Switch>
			</div>
		</div>
	);
};

export default HomeScreen;
