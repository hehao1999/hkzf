import React, { Component } from 'react'
import { PickerView } from 'antd-mobile'
import FilterFooter from '../../../../components/FilterFooter'


export default class FilterPicker extends Component {

  state = {
    value: this.props.defaultValue
  }

  render() {

    const { onCancel, onSave, data, cols, type } = this.props
    const {value} = this.state

    return (
      // 只能返回一个节点，如果想返回多个节点，可以使用空标签，这样不用创建多余节点包裹
      <>
        {/* 选择器组件 */}
        <PickerView
          data={data}
          value={value}
          cols={cols}
          onChange={val => {
            this.setState({
              value: val
            })
          }}
        />
        <FilterFooter
          onCancel={() => onCancel()}
          onOk={() => onSave(type, value)}
        />
      </>
    )
  }  
}
