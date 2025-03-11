import {useState, useEffect} from 'react'
import './App.css'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faPlay, faPause, faStop, faTrashCan} from '@fortawesome/free-solid-svg-icons';

function ClockFace({isRunning, startTime, pauseSnapshot}: {
    isRunning: boolean | null,
    startTime: number,
    pauseSnapshot: number
}) {
    const [time, setTime] = useState(startTime + pauseSnapshot);

    useEffect(() => {
        let intervalId: number | undefined;
        if (isRunning) {
            intervalId = setInterval(() => setTime(new Date().getTime()), 10);
        }

        return () => clearInterval(intervalId);
    }, [isRunning, time]);

    if (!isRunning && time !== startTime + pauseSnapshot) {
        setTime(startTime + pauseSnapshot);
    }

    return (<label>{msToString(time - startTime)}</label>);
}

function Stopwatch({onRemove}: { onRemove: () => void }) {
    const [isRunning, setIsRunning] = useState<boolean | null>(null);
    const [startTime, setStartTime] = useState(new Date().getTime());
    const [pauseSnapshot, setPauseSnapshot] = useState(0);

    function run() {
        setStartTime(new Date().getTime() - pauseSnapshot);
        setIsRunning(true);
    }

    function pause() {
        setPauseSnapshot(new Date().getTime() - startTime);
        setIsRunning(false);
    }

    function reset() {
        setPauseSnapshot(0);
        setIsRunning(null);
    }

    function getActiveSwControls() {
        if (isRunning) {
            return (<>
                <button onClick={pause} title="Pause"><FontAwesomeIcon icon={faPause} /></button>
                <button onClick={reset} title="Reset"><FontAwesomeIcon icon={faStop} /></button>
            </>);
        }
        if (isRunning !== null) {
            return (<>
                <button onClick={run} title="Resume"><FontAwesomeIcon icon={faPlay} /></button>
                <button onClick={reset} title="Reset"><FontAwesomeIcon icon={faStop} /></button>
            </>);
        }
        return (<button onClick={run} title="Start"><FontAwesomeIcon icon={faPlay} /></button>);
    }

    const activeSwControls = getActiveSwControls();

    return (
        <div className="stopwatch">
            <button onClick={onRemove}><FontAwesomeIcon icon={faTrashCan} /></button>
            <ClockFace isRunning={isRunning} startTime={startTime} pauseSnapshot={pauseSnapshot} />
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
            {stopwatchIds.map(id => (<Stopwatch key={id} onRemove={() => removeStopwatch(id)} />))}
            <div>
                <button onClick={addStopwatch}>Add stopwatch</button>
                <button onClick={() => setStopwatchIds([])}>Clear All</button>
            </div>
        </>
    );
}

export default App

// "static" functions

function msToString(ms: number) {
    return `${Math.floor(ms / 3600000)}:${Math.floor(ms / 60000) % 60}:${Math.floor(ms / 1000) % 60}.${Math.floor((ms % 1000) / 10)}`
}
