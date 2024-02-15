import React, { useEffect, useState } from 'react';
import { Checkbox } from 'antd';
import { CheckboxProps } from 'antd/es/checkbox';
import { CheckboxGroupItem, Filter } from '@/share/InterfaceTypes';
import { CheckboxValueType } from 'antd/es/checkbox/Group';
import { setKeyValueName } from '@/redux/getRangeSliderSlice';
import { setFilterObject } from '@/redux/getFilterSlice';
import { AppDispatch } from '@/redux/store';
import { useDispatch } from 'react-redux';

const CustomCheckboxDisEmbarkationGroup: React.FC<CheckboxGroupItem> = ({
    plainOptions,
    checkedList,
    setCheckedList,
    label,
    show, varName,
}) => {

    const dispatch: AppDispatch = useDispatch();
    const [checkAll, setCheckAll] = useState(false);
    const storedValue = localStorage.getItem("filterObject");

    useEffect(() => {
        setCheckAll(checkedList.length === plainOptions.length);
        dispatch(setKeyValueName(varName));
        if (storedValue) {
            const parsedValue = JSON.parse(storedValue);
            const filter: Filter[] = parsedValue.filter;
            dispatch(setFilterObject(filter));
        }
    }, [checkedList, plainOptions, varName]);

    const onChange = (list: CheckboxValueType[]) => {
        setCheckedList(list);
        updatedSliderToLocalStrage(list as string[])
    };

    const onCheckAllChange: CheckboxProps['onChange'] = (e) => {
        const isChecked = e.target.checked;
        setCheckAll(isChecked);
        setCheckedList(isChecked ? plainOptions : []);
    };

    const indeterminate =
        checkedList.length > 0 && checkedList.length < plainOptions.length;

    function updatedSliderToLocalStrage(updateValue: string[]) {
        const existingFilterObjectString = localStorage.getItem('filterObject');
        let existingFilterObject: any = {};

        if (existingFilterObjectString) {
            existingFilterObject = JSON.parse(existingFilterObjectString);
        }
        const existingFilters: Filter[] = existingFilterObject.filter || [];
        const existingFilterIndex = existingFilters.findIndex(filter => filter.varName === varName);

        if (existingFilterIndex !== -1) {
            existingFilters[existingFilterIndex].searchTerm = updateValue as string[]
        } else {
            const newFilter: Filter = {
                varName: varName,
                searchTerm: updateValue!,
                op: "in"
            };
            existingFilters.push(newFilter);
        }
        dispatch(setFilterObject(existingFilters));
        const filterObjectUpdate = {
            filter: existingFilters
        };

        const filterObjectString = JSON.stringify(filterObjectUpdate);
        localStorage.setItem('filterObject', filterObjectString);
    }


    return (
        <div className="regions-checkbox">
            <Checkbox
                onChange={onCheckAllChange}
                checked={checkAll}
                indeterminate={indeterminate}
            >
                {label}
            </Checkbox>
            {show && (
                <div className="tooltip-box">
                    <Checkbox.Group
                        className="sidebar-label"
                        style={{ display: 'flex', flexDirection: 'column' }}
                        options={plainOptions}
                        value={checkedList}
                        onChange={onChange}
                    />
                </div>
            )}
        </div>
    );
};

export default CustomCheckboxDisEmbarkationGroup;
