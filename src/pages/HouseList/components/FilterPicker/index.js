import React, { Component } from 'react'
import { PickerView } from 'antd-mobile'
import FilterFooter from '../../../../components/FilterFooter'

const province = [

]

export default class FilterPicker extends Component {
  render() {
    const { onCancel, onSave, data,cols } = this.props
    return (
      // 只能返回一个节点，如果想返回多个节点，可以使用空标签，这样不用创建多余节点包裹
      <>
        {/* 选择器组件 */}
        <PickerView data={data} value={null} cols={cols} />
        <FilterFooter
          onCancel={() => onCancel}
          onOk={() => onSave}
        />
      </>
    )
  }  
}
