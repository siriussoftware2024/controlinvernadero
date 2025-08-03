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
        if (loading) return 'bg-blue-400';
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
        if (loading) return 'text-blue-600 bg-blue-100';
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

    const getCardColor = () => {
        if (loading) return 'border-blue-200 bg-blue-50';
        return 'border-gray-200 bg-white';
    };

    return (
        <div className={`px-6 py-2 rounded-xl border-2 ${getCardColor()} shadow-lg hover:shadow-xl transition-all duration-300 ${loading ? 'ring-2 ring-blue-300' : ''}`}>
            <div className="flex justify-between items-center space-x-3 mb-1">
                <div className='flex items-center space-x-3'>
                    <div className={`p-2 rounded-lg ${getIconColor()}`}>
                        {icon}
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
                        {loading && (
                            <span className="text-xs text-blue-600 animate-pulse">
                                Actualizando...
                            </span>
                        )}
                    </div>
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
                                className={`w-20 px-2 py-1 text-center border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${loading ? 'bg-blue-50 cursor-not-allowed' : ''}`}
                            />
                            <span className="text-sm text-gray-600">{unit}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-600">
                    <span>{min}{unit}</span>
                    <span>{max}{unit}</span>
                </div>
                <div className="relative">
                    <input
                        type="range"
                        min={min}
                        max={max}
                        step={step}
                        value={inputValue}
                        onChange={handleSliderChange}
                        disabled={loading}
                        className={`w-full h-2 rounded-lg appearance-none cursor-pointer ${loading ? 'cursor-not-allowed opacity-50' : ''}`}
                        style={{
                            background: `linear-gradient(to right, ${getProgressColor()} 0%, ${getProgressColor()} ${((inputValue - min) / (max - min)) * 100}%, #e5e7eb ${((inputValue - min) / (max - min)) * 100}%, #e5e7eb 100%)`
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default SetpointControl; 