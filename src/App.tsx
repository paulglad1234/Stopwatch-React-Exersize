import {useState} from 'react'
import './App.css'

function Stopwatch({onRemove}: { onRemove: () => void }) {
    return (
        <div className="stopwatch">
            <button onClick={onRemove}>D</button>
            00:00:00
        </div>
    );
}

type StopwatchId = number;

function App() {
    const [stopwatchIds, setStopwatchIds] = useState<StopwatchId[]>([]);

    function getNewStopwatchId(): StopwatchId {
        return stopwatchIds[stopwatchIds.length - 1] + 1 || 0;
    }

    function addStopwatch() {
        const newId: StopwatchId = getNewStopwatchId();
        setStopwatchIds([...stopwatchIds, newId]);
    }

    function removeStopwatch(id: StopwatchId) {
        const index = stopwatchIds.indexOf(id);
        setStopwatchIds([
            ...stopwatchIds.slice(0, index),
            ...stopwatchIds.slice(index + 1)
        ]);
    }

    return (
        <>
            {stopwatchIds.map(id => (<Stopwatch key={id} onRemove={() => removeStopwatch(id)} />))}
            <div>
                <button onClick={addStopwatch}>Add stopwatch</button>
                <button onClick={() => setStopwatchIds([])}>Clear All</button>
            </div>
        </>
    );
}

export default App
