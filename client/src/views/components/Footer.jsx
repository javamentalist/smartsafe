import React from 'react';
import { lightGreenA400, amberA400, deepOrangeA400 } from 'material-ui/styles/colors';

const style = {
    indicatorGreen: {
        display: 'inline-block',
        width: '10px',
        height: '10px',
        borderRadius: '50%',
        backgroundColor: lightGreenA400,
        boxShadow: `0px 0px 2px ${lightGreenA400}`
    },
    indicatorOrange: {
        display: 'inline-block',
        width: '10px',
        height: '10px',
        borderRadius: '50%',
        backgroundColor: amberA400,
        boxShadow: `0px 0px 2px ${amberA400}`
    },
    indicatorRed: {
        display: 'inline-block',
        width: '10px',
        height: '10px',
        borderRadius: '50%',
        backgroundColor: deepOrangeA400,
        boxShadow: `0px 0px 2px ${deepOrangeA400}`
    }
};

const Footer = () => (
    <footer className="app-footer row row--no-margin middle-xs">
      <div className="col-xs-12">
        <div className="row row--no-margin">
          <div className="col-xs-10 center-xs">Uploading file...</div>
          <div className="col-xs-1 end-xs">
            <span className="indicator indicator--green" style={ style.indicatorGreen }></span>
          </div>
          <div className="col-xs-1 start-xs">
            <span className="indicator indicator--red" style={ style.indicatorGreen }></span>
          </div>
        </div>
      </div>
    </footer>
);

export default Footer;