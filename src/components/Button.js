import React, { Component } from 'react';
import PointTarget from 'react-point'



class Button extends React.Component {
  render() {
    const { onClick, className, ...props } = this.props
    
    return (
      <PointTarget onPoint={onClick}>
        <button className={`cButtons ${className}`} {...props}/>
      </PointTarget>
    )
  }
}


export default Button;

