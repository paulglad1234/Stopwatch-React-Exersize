import {useState, useEffect} from 'react'
import './App.css'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faPlay, faPause, faStop, faTrashCan} from '@fortawesome/free-solid-svg-icons';

function RemoveButton({onRemove}: { onRemove: () => void }) {
    // Profiler showed that for some reason the trash can icon got re-rendered every update of ClockFace
    // My first instinct was to move it to this separate component, and it somehow helped...
    // Probably need to run it by mentors
    return (<button onClick={onRemove}><FontAwesomeIcon icon={faTrashCan}/></button>);

    // off-topic: also ask a mentor about `function name()` vs `const name = function ()`
}

function ClockFace({isRunning, startTime, pauseSnapshot}: {
    isRunning: boolean | null,
    startTime: number,
    pauseSnapshot: number
}) {
    const [time, setTime] = useState(startTime + pauseSnapshot);

    useEffect(() => {
        let intervalId: ReturnType<typeof setInterval> | undefined;
        if (isRunning) {
            intervalId = setInterval(() => setTime(new Date().getTime()), 1000 / 60); // run setTime at 60 hertz
        }

        return () => clearInterval(intervalId);
    }, [isRunning, time]);

    if (!isRunning && time !== startTime + pauseSnapshot) {
        setTime(startTime + pauseSnapshot);
    }

    return (<label>{msToString(time - startTime)}</label>);
}

function ButtonsWhenRunning({onPause, onReset}: { onPause: () => void, onReset: () => void }) {
    return (<>
        <button onClick={onPause} title="Pause"><FontAwesomeIcon icon={faPause}/></button>
        <button onClick={onReset} title="Reset"><FontAwesomeIcon icon={faStop}/></button>
    </>);
}

function ButtonsWhenPaused({onResume, onReset}: { onResume: () => void, onReset: () => void }) {
    return (<>
        <button onClick={onResume} title="Resume"><FontAwesomeIcon icon={faPlay}/></button>
        <button onClick={onReset} title="Reset"><FontAwesomeIcon icon={faStop}/></button>
    </>);
}

function ButtonsWhenStopped({onStart}: { onStart: () => void }) {
    return (<button onClick={onStart} title="Start"><FontAwesomeIcon icon={faPlay}/></button>);
}

function Stopwatch({onRemove}: { onRemove: () => void }) {
    const [isRunning, setIsRunning] = useState<boolean | null>(null); // true - running, false - paused, null - reset
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

    return (
        <div className="stopwatch">
            <RemoveButton onRemove={onRemove} />
            <ClockFace isRunning={isRunning} startTime={startTime} pauseSnapshot={pauseSnapshot}/>
            {isRunning
                ? (<ButtonsWhenRunning onPause={pause} onReset={reset}/>)
                : isRunning == null
                    ? (<ButtonsWhenStopped onStart={run}/>)
                    : (<ButtonsWhenPaused onResume={run} onReset={reset}/>)}
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

// "static" functions

function msToString(ms: number) {
    const minutes = (Math.floor(ms / 60000) % 60).toString().padStart(2, '0');
    const seconds = (Math.floor(ms / 1000) % 60).toString().padStart(2, '0');
    const tensOfMilliseconds = Math.floor((ms % 1000) / 10).toString().padStart(2, '0');
    return `${Math.floor(ms / 3600000)}:${minutes}:${seconds}.${tensOfMilliseconds}`;
}
