import React from 'react';

import './Home.css';

const Home = () => {
    return (
        <div>
            <div id='home'>
                <div className="landing-text">
                    <h1>Lorem Ipsum</h1>
                    <h3>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</h3>
                    <a href='/login' className="btn btn-light">Empieza ya</a>
                </div>
            </div>

            <div className='padding'>
            <div className='container'>
                <div className="row">
                    <div className='col-sm-6'>
                        <h2>Ola</h2>
                    </div>
                    <div className='col-sm-6 text-center'>
                        <h2>All about lorem ipsum</h2>
                        <p className="lead">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed volutpat posuere suscipit. 
                            Aenean sit amet facilisis erat. Morbi luctus a nisl vitae sollicitudin. Maecenas mattis est sit amet auctor rhoncus. 
                            Nulla vehicula tincidunt nunc nec accumsan. Pellentesque dignissim lorem eget est mollis gravida.
                        </p>
                        <p className="lead">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed volutpat posuere suscipit. 
                            Aenean sit amet facilisis erat. Morbi luctus a nisl vitae sollicitudin. Maecenas mattis est sit amet auctor rhoncus. 
                            Nulla vehicula tincidunt nunc nec accumsan. Pellentesque dignissim lorem eget est mollis gravida.
                        </p>
                    </div>
                </div>
            </div>
            </div>
            

        </div>
    )
}

export default Home;