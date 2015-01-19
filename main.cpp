#include "mainwindow.h"
#include <QApplication>
#include <QDesktopWidget>

int main(int argc, char *argv[])
{
    QApplication a(argc, argv);
    QRect screenRect = QApplication::desktop()->screenGeometry();

    MainWindow w;
    int width = screenRect.width() > 1000 ? 1000:screenRect.width();
    w.setGeometry(screenRect.width()/2 -width/2,(screenRect.height() > 600? (screenRect.height()/2-300):0),width,600);

    w.show();

    return a.exec();
}
