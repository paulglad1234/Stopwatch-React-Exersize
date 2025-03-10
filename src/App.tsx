import {useState} from 'react'
import './App.css'

function Stopwatch({onRemove}: { onRemove: () => void }) {
    const [isRunning, setIsRunning] = useState<boolean | null>(null);

    function getActiveSwControls() {
        if (isRunning) {
            return (<>
                <button onClick={() => setIsRunning(false)}>Pause</button>
                <button onClick={() => setIsRunning(null)}>Reset</button>
            </>);
        }
        if (isRunning !== null) {
            return (<>
                <button onClick={() => setIsRunning(true)}>Resume</button>
                <button onClick={() => setIsRunning(null)}>Reset</button>
            </>);
        }
        return (<button onClick={() => setIsRunning(true)}>Start</button>);
    }

    return (
        <div className="stopwatch">
            <button onClick={onRemove}>D</button>
            00:00:00
            {getActiveSwControls()}
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
