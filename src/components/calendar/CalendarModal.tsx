import React from 'react';
import CalendarEditableBox from './CalendarEditableBox';
import './CalendarModal.scss';

type Props = {
    open: Boolean;
    close: () => void;
    header: string;
    children: React.ReactNode;
}

function CalendarModal({open, close, header, children}: Props) {
    return(
        <div className={ open ? 'openModal modal' : 'modal' }>
            { open ? (  
                <section>
                    <header>
                        {header}
                        <button className="add"> &plus; </button>
                        <button className="close" onClick={close}> &times; </button>
                    </header>
                    <main>
                        {children}
                        <CalendarEditableBox init='hello'/>
                    </main>
                    <footer>
                        <button className="close" onClick={close}> close </button>
                    </footer>
                </section>
            ) : null }
        </div>
    );
}

export default CalendarModal;