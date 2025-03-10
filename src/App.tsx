import {useState, useEffect} from 'react'
import './App.css'

function ClockFace({isRunning}: { isRunning: boolean | null }) {
    const [time, setTime] = useState(0);

    useEffect(() => {
        let intervalId: NodeJS.Timeout;
        if (isRunning) {
            intervalId = setInterval(() => setTime(time + 10), 10);
        }

        return () => clearInterval(intervalId);
    }, [isRunning, time]);

    function stringFromMs(ms: number) {
        return `${Math.floor(ms / 3600000)}:${Math.floor(ms / 60000) % 60}:${Math.floor(ms / 1000) % 60}.${Math.floor((ms % 1000) / 10)}`
    }

    return (<label>{stringFromMs(time)}</label>);
}

function Stopwatch({onRemove}: { onRemove: () => void }) {
    const [isRunning, setIsRunning] = useState<boolean | null>(null);

    function run() {
        setIsRunning(true);
    }

    function pause() {
        setIsRunning(false);
    }

    function reset() {
        setIsRunning(null);
    }

    function getActiveSwControls() {
        if (isRunning) {
            return (<>
                <button onClick={pause}>Pause</button>
                <button onClick={reset}>Reset</button>
            </>);
        }
        if (isRunning !== null) {
            return (<>
                <button onClick={run}>Resume</button>
                <button onClick={reset}>Reset</button>
            </>);
        }
        return (<button onClick={run}>Start</button>);
    }

    const activeSwControls = getActiveSwControls();

    return (
        <div className="stopwatch">
            <button onClick={onRemove}>D</button>
            <ClockFace isRunning={isRunning}/>
            {activeSwControls}
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
            {stopwatchIds.map(id => (<Stopwatch key={id} onRemove={() => removeStopwatch(id)}/>))}
            <div>
                <button onClick={addStopwatch}>Add stopwatch</button>
                <button onClick={() => setStopwatchIds([])}>Clear All</button>
            </div>
        </>
    );
}

export default App
