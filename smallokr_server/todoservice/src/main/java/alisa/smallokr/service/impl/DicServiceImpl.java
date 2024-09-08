package alisa.smallokr.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import alisa.smallokr.entity.DicEntry;
import alisa.smallokr.mapper.DicMapper;
import alisa.smallokr.service.DicService;

@Service
public class DicServiceImpl implements DicService {
    @Autowired
    private DicMapper dicMapper;

    @Override
    public List<DicEntry> getDicEntrys(String dicName) {
        return dicMapper.getDicEntrys(dicName);
    }

}
