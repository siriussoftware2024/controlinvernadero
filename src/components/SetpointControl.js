import React, { useState } from 'react';

const SetpointControl = ({
    title,
    value,
    onValueChange,
    min = 0,
    max = 100,
    step = 1,
    unit = '',
    icon,
    color = 'blue',
    loading = false
}) => {
    const [inputValue, setInputValue] = useState(value);

    const handleSliderChange = (e) => {
        const newValue = parseFloat(e.target.value);
        setInputValue(newValue);
        onValueChange(newValue);
    };

    const handleInputChange = (e) => {
        const newValue = parseFloat(e.target.value);
        setInputValue(newValue);
    };

    const handleInputBlur = () => {
        const clampedValue = Math.max(min, Math.min(max, inputValue));
        setInputValue(clampedValue);
        onValueChange(clampedValue);
    };

    const handleInputKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleInputBlur();
        }
    };

    const getProgressColor = () => {
        switch (color) {
            case 'green':
                return 'bg-green-500';
            case 'red':
                return 'bg-red-500';
            case 'yellow':
                return 'bg-yellow-500';
            case 'blue':
            default:
                return 'bg-blue-500';
        }
    };

    const getIconColor = () => {
        switch (color) {
            case 'green':
                return 'text-green-600 bg-green-100';
            case 'red':
                return 'text-red-600 bg-red-100';
            case 'yellow':
                return 'text-yellow-600 bg-yellow-100';
            case 'blue':
            default:
                return 'text-blue-600 bg-blue-100';
        }
    };

    return (
        <div className="px-6 py-2 rounded-xl border-2 border-gray-200 bg-white shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex justify-between items-center space-x-3 mb-1">
                <div className='flex items-center space-x-3'>
                    <div className={`p-2 rounded-lg ${getIconColor()}`}>
                        {icon}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800">{title}</h3>

                </div>





                <div className="space-y-1">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 font-bold mr-3">Valor actual</span>
                        <div className="flex items-center space-x-2">
                            <input
                                type="number"
                                value={inputValue}
                                onChange={handleInputChange}
                                onBlur={handleInputBlur}
                                onKeyPress={handleInputKeyPress}
                                min={min}
                                max={max}
                                step={step}
                                disabled={loading}
                                className="w-20 px-2 py-1 text-center border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <span className="text-sm text-gray-600">{unit}</span>
                        </div>
                    </div>
                </div>
            </div>


            <div className="relative">
                <input
                    type="range"
                    min={min}
                    max={max}
                    step={step}
                    value={value}
                    onChange={handleSliderChange}
                    disabled={loading}
                    className="w-full h- bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                    style={{
                        background: `linear-gradient(to right, ${getProgressColor()} 0%, ${getProgressColor()} ${((value - min) / (max - min)) * 100}%, #e5e7eb ${((value - min) / (max - min)) * 100}%, #e5e7eb 100%)`
                    }}
                />
                <div className="flex justify-between text-xs text-gray-500">
                    <span>{min}{unit}</span>
                    <span>{max}{unit}</span>
                </div>
            </div>

            {loading && (
                <div className="text-center">
                    <div className="text-sm text-gray-500">Actualizando...</div>
                </div>
            )}
        </div>
    );
};

export default SetpointControl; 