import React, { Component } from 'react';
import Button from './Button';
import Screen from './Screen';



const CalculatorOperations = {
  '/': (formerValue, nextValue) => formerValue / nextValue,
  '*': (formerValue, nextValue) => formerValue * nextValue,
  '+': (formerValue, nextValue) => formerValue + nextValue,
  '-': (formerValue, nextValue) => formerValue - nextValue,
  '=': (formerValue, nextValue) => nextValue
}

class Body extends React.Component {
  state = {
    value: null,
    displayValue: '0',
    operator: null,
    waitingForOperand: false
  };
  
  clearAll() {
    this.setState({
      value: null,
      displayValue: '0',
      operator: null,
      waitingForOperand: false
    })
  }

  clearDisplay() {
    this.setState({
      displayValue: '0'
    })
  }
  
  clearLastChar() {
    const { displayValue } = this.state
    
    this.setState({
      displayValue: displayValue.substring(0, displayValue.length - 1) || '0'
    })
  }
  
  toggleSign() {
    const { displayValue } = this.state
    const newValue = parseFloat(displayValue) * -1
    
    this.setState({
      displayValue: String(newValue)
    })
  }
  
  inputPercent() {
    const { displayValue } = this.state
    const currentValue = parseFloat(displayValue)
    
    if (currentValue === 0)
      return
    
    const fixedDigits = displayValue.replace(/^-?\d*\.?/, '')
    const newValue = parseFloat(displayValue) / 100
    
    this.setState({
      displayValue: String(newValue.toFixed(fixedDigits.length + 2))
    })
  }
  
  inputDecimal() {
    const { displayValue } = this.state
    
    if (!(/\./).test(displayValue)) {
      this.setState({
        displayValue: displayValue + '.',
        waitingForOperand: false
      })
    }
  }
  
  inputNum(digit) {
    const { displayValue, waitingForOperand } = this.state
    
    if (waitingForOperand) {
      this.setState({
        displayValue: String(digit),
        waitingForOperand: false
      })
    } else {
      this.setState({
        displayValue: displayValue === '0' ? String(digit) : displayValue + digit
      })
    }
  }
  
  operate(nextOperator) {    
    const { value, displayValue, operator } = this.state
    const inputValue = parseFloat(displayValue)
    
    if (value == null) {
      this.setState({
        value: inputValue
      })
    } else if (operator) {
      const currentValue = value || 0
      const newValue = CalculatorOperations[operator](currentValue, inputValue)
      
      this.setState({
        value: newValue,
        displayValue: String(newValue)
      })
    }
    
    this.setState({
      waitingForOperand: true,
      operator: nextOperator
    })
  }
  
  handleKeyDown = (event) => {
    let { key } = event
    
    if (key === 'Enter')
      key = '='
    
    if ((/\d/).test(key)) {
      event.preventDefault()
      this.inputNum(parseInt(key, 10))
    } else if (key in CalculatorOperations) {
      event.preventDefault()
      this.operate(key)
    } else if (key === '.') {
      event.preventDefault()
      this.inputDecimal()
    } else if (key === '%') {
      event.preventDefault()
      this.inputPercent()
    } else if (key === 'Backspace') {
      event.preventDefault()
      this.clearLastChar()
    } else if (key === 'Clear') {
      event.preventDefault()
      
      if (this.state.displayValue !== '0') {
        this.clearDisplay()
      } else {
        this.clearAll()
      }
    }
  };
  
  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyDown)
  }
  
  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyDown)
  }
  
  render() {
    const { displayValue } = this.state
    
    const clearDisplay = displayValue !== '0'
    const clearText = clearDisplay ? 'CE' : 'CE'
    
    return (
      <div className='cal'>
        <Screen value={displayValue}/>
        <div className='cBody'>
          <div className='nonOperators'>
            <div className='nNumbers'>
              <Button onClick={() => clearDisplay ? this.clearDisplay() : this.clearAll()}>{clearText}</Button>
              <Button onClick={() => this.toggleSign()}>±</Button>
              <Button onClick={() => this.inputPercent()}>%</Button>
            </div>
            <div className='numbers'>
              <Button className='zero' onClick={() => this.inputNum(0)}>0</Button>
              <Button onClick={() => this.inputDecimal()}>●</Button>
              <Button onClick={() => this.inputNum(1)}>1</Button>
              <Button onClick={() => this.inputNum(2)}>2</Button>
              <Button onClick={() => this.inputNum(3)}>3</Button>
              <Button onClick={() => this.inputNum(4)}>4</Button>
              <Button onClick={() => this.inputNum(5)}>5</Button>
              <Button onClick={() => this.inputNum(6)}>6</Button>
              <Button onClick={() => this.inputNum(7)}>7</Button>
              <Button onClick={() => this.inputNum(8)}>8</Button>
              <Button onClick={() => this.inputNum(9)}>9</Button>
            </div>
          </div>
          <div className='operators'>
            <Button onClick={() => this.operate('/')}>÷</Button>
            <Button onClick={() => this.operate('*')}>×</Button>
            <Button onClick={() => this.operate('-')}>−</Button>
            <Button onClick={() => this.operate('+')}>+</Button>
            <Button onClick={() => this.operate('=')}>=</Button>
          </div>
        </div>
      </div>
    )
  }
}


export default Body;