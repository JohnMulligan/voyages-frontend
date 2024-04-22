import React, { useState, useEffect, SyntheticEvent, UIEventHandler, useRef } from 'react';
import {
    Autocomplete,
    TextField,
    Typography,
    ListSubheader,
    Paper,
    Checkbox,
    AutocompleteRenderOptionState,
} from '@mui/material';
import { AppDispatch, RootState } from '@/redux/store';
import { useDispatch, useSelector } from 'react-redux';
import {
    AutoCompleteInitialState,
    AutoCompleteOption,
    DataSuggestedValuesProps,
    Filter,
    RangeSliderState,
} from '@/share/InterfaceTypes';
import CheckIcon from '@mui/icons-material/Check';
import CheckBoxOutlineBlankOutlinedIcon from '@mui/icons-material/CheckBoxOutlineBlankOutlined';
import { setAutoLabel } from '@/redux/getAutoCompleteSlice';
import '@/style/Slider.scss';
import '@/style/table.scss';
import { usePageRouter } from '@/hooks/usePageRouter';
import { IRootFilterObject } from '@/share/InterfaceTypes';
import CustomAutoListboxComponent from './CustomAutoListboxComponent';
import { useAutoComplete } from '@/hooks/useAutoComplete';
import { setFilterObject } from '@/redux/getFilterSlice';
import { filtersDataSend } from '@/utils/functions/filtersDataSend';
import debounce from 'lodash.debounce';
import { fetchAutoVoyageComplete } from '@/fetch/voyagesFetch/fetchAutoVoyageComplete';
import { checkPagesRouteForEnslaved, checkPagesRouteForEnslavers, checkPagesRouteForVoyages } from '@/utils/functions/checkPagesRoute';
import { fetchPastEnslavedAutoComplete } from '@/fetch/pastEnslavedFetch/fetchPastEnslavedAutoCompleted';
import { fetchPastEnslaversAutoCompleted } from '@/fetch/pastEnslaversFetch/fetchPastEnslaversAutoCompleted';

export default function VirtualizedAutoCompleted() {
    const dispatch: AppDispatch = useDispatch();
    const { varName } = useSelector(
        (state: RootState) => state.rangeSlider as RangeSliderState
    );
    const { styleName } = usePageRouter();
    const limit = 20;
    const { filtersObj } = useSelector((state: RootState) => state.getFilter);
    const [autoList, setAutoList] = useState<AutoCompleteOption[]>([]);
    const [selectedValue, setSelectedValue] = useState<AutoCompleteOption[]>([]);
    const [autoValue, setAutoValue] = useState<string>('');
    const [offset, setOffset] = useState<number>(0);
    const [position, setPosition] = useState<number>(0);
    const listboxNodeRef = useRef<HTMLUListElement | null>(null);
    const [page, setPage] = useState(1);

    const filters = filtersDataSend(filtersObj, styleName!);
    const dataSend: IRootFilterObject = {
        varName: varName,
        querystr: autoValue,
        offset: offset,
        limit: limit,
        filter: filters,
    };
    const fetchAutoList = async () => {
        try {
            let response;
            if (checkPagesRouteForVoyages(styleName!)) {
                response = await fetchAutoVoyageComplete(dataSend);
            } else if (checkPagesRouteForEnslaved(styleName!)) {
                response = await fetchPastEnslavedAutoComplete(dataSend);
            } else if (checkPagesRouteForEnslavers(styleName!)) {
                response = await fetchPastEnslaversAutoCompleted(dataSend);
            }
            const { suggested_values } = response as DataSuggestedValuesProps;
            const newAutoList: AutoCompleteOption[] = suggested_values.map(
                (value: AutoCompleteOption) => value
            );

            // Create a Set to track unique values
            const uniqueValues = new Set<string>();
            newAutoList.forEach((value) => uniqueValues.add(value.value));

            // Convert Set back to an array without duplicates
            const filteredAutoList = Array.from(uniqueValues).map((value) => ({
                value,
            }));

            setAutoList((prevAutoList) => {
                const uniquePrevAutoList = prevAutoList.filter(
                    (item) => !uniqueValues.has(item.value)
                );
                return [...filteredAutoList, ...uniquePrevAutoList];
            });
        } catch {

        }
    }

    useEffect(() => {
        fetchAutoList()

        const storedValue = localStorage.getItem('filterObject');
        if (!storedValue) return;

        const parsedValue = JSON.parse(storedValue);
        const filter: Filter[] = parsedValue.filter;
        const filterByVarName =
            filter?.length > 0 &&
            filter.find((filterItem) => filterItem.varName === varName);
        if (!filterByVarName) return;

        const autoValueList: string[] = filterByVarName.searchTerm as string[];

        const values = autoValueList.map<AutoCompleteOption>((item: string) => ({
            value: item,
        }));
        setSelectedValue(() => values);
        dispatch(setFilterObject(filter));
    }, []);

    useEffect(() => {
        if (listboxNodeRef.current !== null) {
            listboxNodeRef.current.scrollTop = position;
        }
    }, [position, listboxNodeRef, offset]);

    const handleScroll: UIEventHandler<HTMLUListElement> = (event) => {
        const { currentTarget } = event;
        const position = currentTarget.scrollTop + currentTarget.clientHeight;
        console.log({ position }, currentTarget.scrollHeight)
        if (currentTarget.scrollHeight - position <= 1) {
            setPosition(position);
            loadMoreResults();
        }
    };

    const loadMoreResults = () => {
        // if (!isLoading && !isError && data) {
        const nextPage = page + 1
        setPage(nextPage);
        const newOffset = nextPage * limit;
        setOffset(newOffset);
        // fetchAutoList()
        // const { suggested_values } = data as DataSuggestedValuesProps;
        // fetchAutoList()
        // const newAutoList: AutoCompleteOption[] = suggested_values.map(
        const newAutoList: AutoCompleteOption[] = autoList.map(
            (value: AutoCompleteOption) => value
        );
        const items = paginate(newAutoList, limit, nextPage);
        setAutoList((prevAutoList) => [...prevAutoList, ...items]);
        // }
    }

    // Debounce the handleInputChange function
    const debouncedHandleInputChange = debounce(
        (event: React.SyntheticEvent<Element, Event>, value: string) => {
            if (event) {
                event.preventDefault();
            }
            setAutoValue(value);
        },
        300
    );

    // Use the debounced function in your Autocomplete component
    const handleInputChange = (event: React.SyntheticEvent<Element, Event>, value: string) => {
        debouncedHandleInputChange(event, value);
    };

    const handleAutoCompletedChange = (
        event: SyntheticEvent<Element, Event>,
        newValue: AutoCompleteOption[]
    ) => {
        if (!newValue) return;

        const autuLabels: string[] = newValue.map((ele) => ele.value);
        dispatch(setAutoLabel(autuLabels));
        setSelectedValue(newValue as AutoCompleteOption[]);

        // Update autoList based on selected items
        const updatedAutoList = autoList.filter((item) =>
            !newValue.some((selectedItem) => selectedItem.value === item.value)
        );

        // Move selected items to the top of the autoList
        const selectedItems = newValue.map((item) => ({
            value: item.value,
            selected: true,
        }));
        const reorderedAutoList = [...selectedItems, ...updatedAutoList];
        setAutoList(reorderedAutoList);

        // Update filter and save to localStorage
        updateFilter(newValue);
    };

    const updateFilter = (newValue: AutoCompleteOption[]) => {
        const existingFilterObjectString = localStorage.getItem('filterObject');
        let existingFilters: Filter[] = [];

        if (existingFilterObjectString) {
            existingFilters = JSON.parse(existingFilterObjectString).filter || [];
        }

        const existingFilterIndex = existingFilters.findIndex(
            (filter) => filter.varName === varName
        );

        if (Array.isArray(newValue) && newValue.length > 0) {
            if (existingFilterIndex !== -1) {
                existingFilters[existingFilterIndex].searchTerm = newValue.map((ele) => ele.value);
            } else {
                existingFilters.push({
                    varName: varName,
                    searchTerm: newValue.map((ele) => ele.value),
                    op: 'in',
                });
            }
        } else if (existingFilterIndex !== -1) {
            existingFilters[existingFilterIndex].searchTerm = [];
        }

        const filteredFilters = existingFilters.filter((filter) =>
            !Array.isArray(filter.searchTerm) || filter.searchTerm.length > 0
        );
        dispatch(setFilterObject(filteredFilters));

        const filterObjectUpdate = {
            filter: filteredFilters,
        };
        const filterObjectString = JSON.stringify(filterObjectUpdate);
        localStorage.setItem('filterObject', filterObjectString);
    };

    const renderGroup = (params: any) => [
        <ListSubheader key={params.key} component="div">
            {params.group}
        </ListSubheader>,
        params.children,
    ];

    const optionRenderer = (
        props: React.HTMLAttributes<HTMLLIElement>,
        option: AutoCompleteOption,
        { selected }: AutocompleteRenderOptionState
    ) => {
        return (
            <li {...props} key={`${option.value}`}>
                <Checkbox
                    color="primary"
                    icon={<CheckBoxOutlineBlankOutlinedIcon fontSize="small" />}
                    checkedIcon={<CheckIcon fontSize="small" />}
                    checked={selected}
                />
                {getOptionLabel(option)}
            </li>
        );
    };

    const getOptionLabel = (option: AutoCompleteOption) => {
        const textContent = new DOMParser().parseFromString(
            option.value ?? '',
            'text/html'
        ).body.textContent;
        return textContent ?? '';
    };

    return (
        <Autocomplete
            loading
            disableCloseOnSelect
            // ListboxComponent={CustomAutoListboxComponent}
            multiple
            autoHighlight
            id="tags-outlined"
            style={{ width: 450 }}
            options={autoList}
            getOptionLabel={getOptionLabel}
            ListboxProps={{
                onScroll: handleScroll,
            }}
            isOptionEqualToValue={(option, value) => {
                return option.value === value.value;
            }}
            renderOption={optionRenderer}
            onInputChange={handleInputChange}
            inputValue={autoValue}
            value={selectedValue}
            onChange={handleAutoCompletedChange}
            renderGroup={renderGroup}
            PaperComponent={({ children }) => (
                <Paper className="auto-options-list">{children}</Paper>
            )}
            renderInput={(params) => (
                <TextField
                    {...params}
                    variant="outlined"
                    label={
                        <Typography variant="body1" style={{ fontSize: 14 }} height={50}>
                            field
                        </Typography>
                    }
                    placeholder="SelectedOptions"
                    style={{ marginTop: 20 }}
                />
            )}
        />
    );
}


function paginate<T>(array: T[], page_size: number, page_number: number): T[] {
    return array.slice((page_number - 1) * page_size, page_number * page_size);
}
